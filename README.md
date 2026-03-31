# 📒 Personal Notes App

A secure personal notes management application built with **Next.js 14**, **TypeScript**, **MongoDB**, and **Tailwind CSS**. Features full CRUD operations, AES encryption for sensitive notes, and advanced search functionality.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Data Model](#-data-model)
- [Encryption](#-encryption)
- [Search Functionality](#-search-functionality)
- [Screenshots](#-screenshots)
- [Known Limitations](#-known-limitations)
- [Future Improvements](#-future-improvements)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

- **Full CRUD Operations** — Create, Read, Update, and Delete personal notes
- **Sensitive Content Encryption** — AES-256 encryption for notes marked as sensitive
- **Advanced Search** — Search notes by keyword, description, or content
- **Date Range Filtering** — Filter notes by date range (from/to)
- **Modal-Based Forms** — Clean modal interface for creating and editing notes
- **Keyword Tagging** — Tag notes with multiple keywords for easy categorization
- **Toggle Sensitive Content** — Show/hide encrypted content on the UI
- **Responsive Design** — Fully responsive layout for desktop, tablet, and mobile
- **Toast Notifications** — Real-time feedback for all operations
- **Auto-Generated Note IDs** — Unique note IDs generated automatically
- **MongoDB Text Indexing** — Efficient database-level search indexing

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [MongoDB](https://www.mongodb.com/) | NoSQL database |
| [Mongoose](https://mongoosejs.com/) | MongoDB ODM |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [crypto-js](https://www.npmjs.com/package/crypto-js) | AES encryption/decryption |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x — [Download](https://nodejs.org/)
- **npm** >= 9.x (comes with Node.js)
- **MongoDB** >= 6.x — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)

Verify your installations:

```bash
node --version    # Should output v18.x.x or higher
npm --version     # Should output 9.x.x or higher
mongod --version  # Should output db version v6.x or higher