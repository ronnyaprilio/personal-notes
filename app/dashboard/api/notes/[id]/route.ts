import { decryptContent, encryptContent } from "@/app/lib/encryption";
import Note from "@/app/lib/models/Note";
import { connectDB } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// GET /api/notes/[id] - Get a single note
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const note = await Note.findById(id).lean();

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    const noteObj: any = note;

    const responseNote = {
      ...noteObj,
      _id: noteObj._id.toString(),
      content: noteObj.is_sensitive
        ? decryptContent(noteObj.content)
        : noteObj.content,
    };

    return NextResponse.json(
      { success: true, data: responseNote },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /dashboard/api/notes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch note" },
      { status: 500 }
    );
  }
}

// PUT /api/notes/[id] - Update a note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { description, content, keyword, is_sensitive, dates } = body;

    // Validation
    if (!description || !content) {
      return NextResponse.json(
        { success: false, error: "Description and content are required" },
        { status: 400 }
      );
    }

    const existingNote = await Note.findById(id);
    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    // Process keywords
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

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        description: description.trim(),
        content: processedContent,
        keyword: keywordArray,
        is_sensitive: is_sensitive || false,
        dates: dates ? new Date(dates) : existingNote.dates,
      },
      { new: true, runValidators: true }
    ).lean();

    const noteObj: any = updatedNote;

    const responseNote = {
      ...noteObj,
      _id: noteObj._id.toString(),
      content: is_sensitive ? content : noteObj.content,
    };

    return NextResponse.json(
      { success: true, data: responseNote, message: "Note updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /dashboard/api/notes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /dashboard/api/notes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete note" },
      { status: 500 }
    );
  }
}