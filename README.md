# Personal Notes App

A secure personal notes management application built with Next.js 16, TypeScript, MongoDB, Tailwind CSS, and NextAuth. The app supports note CRUD, sensitive data encryption, search and filtering, keyword tagging, and a Monaco-based content editor.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Data Model](#data-model)
- [Encryption](#encryption)
- [Search Functionality](#search-functionality)
- [Notes](#notes)
- [License](#license)

---

## Features

- **Full CRUD Operations**  Create, Read, Update, and Delete notes from a polished dashboard
- **Sensitive Content Encryption**  Encrypt notes marked as sensitive with AES before storage
- **Keyword Tagging**  Add comma-separated keywords for easy organization
- **Advanced Search**  Search by keyword, description, or content
- **Date Filters**  Filter notes by `dateFrom` / `dateTo`
- **Monaco Editor**  Rich content editor with language detection for note content
- **Show / Hide Sensitive Content**  Hide encrypted note text until explicitly revealed
- **Login Page**  Credential-based login page with NextAuth and reCAPTCHA support
- **Toast Notifications**  Feedback for save, update, delete, and error states
- **Responsive UI**  Works on mobile and desktop with adaptive table and card layouts
- **Server-side Text Indexing**  MongoDB text index on description, content, and keywords

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | App Router, server + client rendering |
| React 18 | UI components |
| TypeScript 5 | Static typing |
| MongoDB | Persistent storage |
| Mongoose | MongoDB data modeling |
| NextAuth 5 Beta | Credentials authentication |
| Tailwind CSS 4 | Styling and layout |
| CryptoJS | AES encryption/decryption |
| @monaco-editor/react | In-browser code editor |

---

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB >= 6.x
- A MongoDB connection string

---

## Installation

```bash
git clone <repository-url>
cd personal-notes
npm install
```

---

## Environment Variables

Create a `.env.local` file in the project root with the following values:

```bash
MONGODB_URI=
AUTH_SECRET=
ENCRYPTION_SECRET=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
LOCAL_PYTHON_COMPILER_API=
```

Optional seed variables for creating an initial admin user with `seed.js`:

```bash
INIT_ADMIN_USERNAME=
INIT_ADMIN_PASSWORD=
USERNAME=
```

---

## Running the Application

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run lint checks:

```bash
npm run lint
```

---

## Project Structure

- `app/`  Next.js App Router pages, API routes, and UI components
  - `app/page.tsx`  Main note dashboard interface
  - `app/dashboard/page.tsx`  Login page with credentials + reCAPTCHA
  - `app/dashboard/api/notes/route.ts`  Notes list and create endpoint
  - `app/dashboard/api/notes/[id]/route.ts`  Note retrieve, update, delete endpoints
  - `app/api/auth/[...nextauth]/route.ts`  NextAuth authentication handlers
  - `app/components/`  UI components for notes, search, modals, and cards
  - `app/lib/`  MongoDB connection, encryption helpers, types, and models
- `public/`  Static assets
- `package.json`  npm scripts and dependencies
- `seed.js`  Optional admin seed script

---

## API Documentation

### GET `/dashboard/api/notes`

Query notes with optional filters:

- `query`  search text across description, keyword, and content
- `dateFrom`  notes created on or after this date
- `dateTo`  notes created on or before this date

### POST `/dashboard/api/notes`

Create a new note. Request body:

```json
{
  "description": "...",
  "content": "...",
  "keyword": "tag1, tag2",
  "is_sensitive": true,
  "dates": "2026-01-01"
}
```

### GET `/dashboard/api/notes/[id]`

Fetch one note by MongoDB document id.

### PUT `/dashboard/api/notes/[id]`

Update an existing note by id.

### DELETE `/dashboard/api/notes/[id]`

Remove a note by id.

### Auth

- `/api/auth/[...nextauth]`  NextAuth credentials provider
- Login page available at `/dashboard`

---

## Data Model

### Note

- `notes_id`  unique note reference
- `description`  short summary
- `content`  note body or encrypted payload
- `keyword`  array of tags
- `is_sensitive`  encrypt this note when saved
- `dates`  note date metadata
- `createdAt`, `updatedAt`  Mongoose timestamps

### User

- `username`
- `password`  hashed password stored in MongoDB

---

## Encryption

Sensitive notes use AES encryption via `crypto-js`.

- `ENCRYPTION_SECRET` protects encrypted content
- Content is encrypted before save and decrypted when fetched
- Encrypted notes are shown as hidden until explicitly revealed

---

## Search Functionality

- Text search powered by MongoDB text indexes on description, content, and keyword
- Date range filtering with `dateFrom` / `dateTo`
- Note: encrypted content cannot be searched while stored in encrypted form

---

## Notes

- The app uses a Monaco editor for note content, with language detection based on keywords and content heuristics.
- A credentials-based login flow with reCAPTCHA is implemented, but note list access is currently exposed through the public dashboard route in this repo structure.

---

## License

No license specified.
