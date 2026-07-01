# Web-Based Personalized Lecture and Examination Timetable Generation System (TAG Model)

A comprehensive, production-ready Full-Stack application designed for Lagos State University (LASU) Computer Science department.

## Features
- **TAG Engine:** Instantly detects clashes and generates personalized timetables.
- **Global Course Search:** Instantly search all available courses (Compulsory, Electives, Carry-overs, Borrowed).
- **PDF Export:** Export your generated timetables to clean PDF format.
- **Admin Dashboard:** Secure login (JWT/bcrypt) to manage courses and timetables.
- **Apple-Inspired Design:** Clean, minimalist UI with LASU branding (Crest watermark, True Blue).

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Axios.
- **Backend:** Node.js, Express, TypeScript, MySQL2, PDFKit, JWT, bcrypt.

## Installation Guide

### Prerequisites
1. Node.js (v18+)
2. MySQL (running locally on default port 3306)

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or CLI).
2. Run the `database/schema.sql` script to create the `lasu_tag_db` and tables.
3. Run the `database/seed.sql` script to populate dummy courses and the default admin.
   - **Default Admin Username:** `admin`
   - **Default Admin Password:** `admin123`

### 2. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create a `.env` file inside the `server` directory (or use default configs defined in `env.ts` if root user has no password):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=lasu_tag_db
   JWT_SECRET=super_secret_lasu_key_12345
   ```
3. Install dependencies and start the backend:
   ```bash
   npm install
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies and start the frontend:
   ```bash
   npm install
   npm run dev
   ```

### 4. Usage
- Visit the frontend URL (usually `http://localhost:3000`).
- Select your academic level.
- Search and add courses. Note that the global search will look through all courses regardless of the initially selected level.
- Click "Generate Timetables" to see the output and potential clashes.
- Download the result as a PDF.
- Login to `/admin/login` using `admin` / `admin123` to manage data.
