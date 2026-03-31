import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Note from "@/app/lib/models/Note";
import { decryptContent, encryptContent } from "@/app/lib/encryption";

function generateNoteId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `NOTE-${timestamp}-${random}`.toUpperCase();
}

// GET /api/notes - List all notes with optional search
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build filter
    const filter: any = {};

    // Text search across keyword, description, content
    if (query) {
      const regex = new RegExp(query, "i");
      filter.$or = [
        { description: regex },
        { keyword: { $elemMatch: { $regex: regex } } },
        // We also search content, but encrypted content won't match
        // This is a known limitation of encrypted content
        { content: regex },
      ];
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.dates = {};
      if (dateFrom) {
        filter.dates.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        filter.dates.$lte = toDate;
      }
    }

    const notes = await Note.find(filter)
      .sort({ dates: -1, createdAt: -1 })
      .lean();

    // Decrypt sensitive content for display
    const decryptedNotes = notes.map((note: any) => ({
      ...note,
      _id: note._id.toString(),
      content: note.is_sensitive
        ? decryptContent(note.content)
        : note.content,
    }));

    return NextResponse.json(
      { success: true, data: decryptedNotes },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /dashboard/api/notes error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { description, content, keyword, is_sensitive, dates } = body;

    // Validation
    if (!description || !content) {
      return NextResponse.json(
        { success: false, error: "Description and content are required" },
        { status: 400 }
      );
    }

    // Process keywords - split by comma and trim
    const keywordArray = keyword
      ? keyword
          .split(",")
          .map((k: string) => k.trim())
          .filter((k: string) => k.length > 0)
      : [];

    // Encrypt content if sensitive
    const processedContent = is_sensitive
      ? encryptContent(content)
      : content;

    const note = await Note.create({
      notes_id: generateNoteId(),
      description: description.trim(),
      content: processedContent,
      keyword: keywordArray,
      is_sensitive: is_sensitive || false,
      dates: dates ? new Date(dates) : new Date(),
    });

    const responseNote = {
      ...note.toObject(),
      _id: note._id.toString(),
      content: is_sensitive ? content : note.content, // Return original content
    };

    return NextResponse.json(
      { success: true, data: responseNote, message: "Note created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /dashboard/api/notes error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A note with this ID already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create note" },
      { status: 500 }
    );
  }
}