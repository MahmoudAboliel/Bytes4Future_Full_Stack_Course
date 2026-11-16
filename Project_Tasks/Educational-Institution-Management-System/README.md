# Educational Institution Management System

EDUMS is an educational institution management system with a React frontend and an Express backend. It supports JWT authentication, role-based access, and management of students, teachers, courses, and academic progress.

## Quick start

Prerequisites: Node.js, npm, and a MongoDB database.

1. Create `Backend/.env` with your MongoDB connection string and a JWT secret:

   ```env
   DB_URI=mongodb://127.0.0.1:27017/edums
   JWT_SECRET=replace-with-a-secure-secret
   ```

2. In one terminal, install backend dependencies. To populate a fresh development database with demo accounts and records, run the seed command before starting the backend:

   ```powershell
   cd Backend
   npm install
   npm run seed
   npm run dev
   ```

   Seeding is optional for starting the server, but provides the initial admin account and sample data. **Only run it against a fresh development/test database:** it deletes existing application records before inserting the demo data. The seeded admin login is `admin@manara.edu` with password `manara`.

3. In a second terminal, install frontend dependencies and start the frontend:

   ```powershell
   cd Frontend
   npm install
   npm run dev
   ```

The frontend uses `http://localhost:4000/api` by default. Set `VITE_API_URL` in `Frontend/.env` if your backend API uses a different URL.
