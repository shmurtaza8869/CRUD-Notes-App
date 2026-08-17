# Full CRUD Notes App

A full-stack note-taking web application backed by a real-time PostgreSQL database powered by Supabase. This project implements complete CRUD (Create, Read, Update, Delete) functionality with persistent cloud storage, responsive card layouts, dynamic state updates, and database-level query filtering.


## Overview

Every web application relies on the core ability to read, write, update, and delete data from a persistent backend. This application serves as a complete demonstration of connecting a frontend interface to a real database backend, managing asynchronous state, and handling full data lifecycle operations.


## Key Features

- Create Notes: Form interface to create new notes with title and content, saving directly to Supabase and refreshing the UI.
- Read & Display: Automatically queries all notes from the Supabase database on page load and renders them as structured cards.
- Update Notes: Inline edit action on each note card pre-fills the form with existing data, updating the specific row in the database without creating duplicates.
- Delete Notes: Removes records permanently from the Supabase database and updates the user interface immediately.
- Confirmation Feedback: Displays a clear "Saved!" status notification upon successful creation or modification of a note.
- Search & Filter (Bonus): Dynamic search bar that queries notes by title using Supabase's case-insensitive .ilike() filter.


## Tech Stack and Tools

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Database / Backend: Supabase (PostgreSQL)
- Client Library: supabase-js npm package
- Development Tools: VS Code, Node.js, Supabase Table Editor, Supabase API Docs


## Database Schema

Table Name: notes

Columns:
- id: Primary Key (uuid or int8, auto-generated)
- title: text (required)
- content: text (required)
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())


## Setup and Installation

1. Clone the repository:
   git clone https://github.com/your-username/crud-notes-app.git
   cd crud-notes-app

2. Install dependencies:
   npm install @supabase/supabase-js

3. Configure Supabase:
   - Create a new project in the Supabase Dashboard.
   - Use the Supabase Table Editor to create the 'notes' table according to the schema above.
   - Obtain your Supabase Project URL and Public Anon Key from Project Settings > API.
   - Configure your client connection:

   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
   const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
   export const supabase = createClient(supabaseUrl, supabaseKey);

4. Run the application:
   Open index.html with Live Server in VS Code, or run:
   npx serve .


## Learning Objectives

- Establishing direct, secure client-to-database communication with Supabase SDK.
- Managing asynchronous JavaScript workflows using async/await.
- Coordinating UI re-renders with database state changes.
- Applying PostgreSQL query filters (.ilike) for real-time data search.
