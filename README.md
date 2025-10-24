# FS-Java-MiniProject

ResearchHub is a collaborative research paper management system with version control, activity tracking, and secure file storage.

Core features
- Create and manage research repositories
- Upload papers and maintain version history per paper
- Preview PDFs and Office documents in-browser
- Stream/download specific versions and track repository activity
- Ownership-based access control (JWT-secured endpoints)

Tech stack
- Backend: Spring Boot (Java 21), MongoDB, Cloudinary for file storage, JWT authentication
- Frontend: React (Vite), Tailwind CSS

Quick start

Prerequisites:
- Java 21
- Maven
- Node.js and npm (for frontend)
- MongoDB (or MongoDB Atlas account)
- Cloudinary account (for file storage)

1) Backend

- Copy `backend/.env.example` to `backend/.env` (or set environment variables) and fill in MongoDB / Cloudinary credentials.
- From the `backend` folder:

```bash
# build and run
./mvnw clean package
./mvnw spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

2) Frontend

- From the `Frontend` folder:

```bash
npm install
npm run dev
```

The frontend runs with Vite (typically on `http://localhost:5173`).

Environment variables

Backend (`backend/.env` or system env):
```
MONGODB_URI=your_mongodb_connection_string
MONGODB_DATABASE=your_database_name
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
JWT_SECRET=some-secret
```

Frontend (`Frontend/.env`):
```
VITE_API_BASE=http://localhost:8080
```

API overview (selected)
- POST /auth/login - login, sets JWT cookie
- POST /auth/logout - logout
- GET /auth/me - current user
- GET /repos/global - list public repos
- GET /repos/my - list user repos
- POST /repos - create repo
- DELETE /repos/{id} - delete repo (owner only)
- POST /papers/upload - upload new paper
- POST /papers/{paperId}/update - upload new version
- GET /papers/by-repo/{repoId} - list papers in repo
- GET /papers/{paperId}/download?inline=true - preview latest
- GET /papers/{paperId}/download - download
- DELETE /papers/{paperId} - delete paper (owner only)

Development notes

- `.env` is loaded by `dotenv-java` in `BackendApplication.java`.
- Cloudinary is used for file storage; backend can stream files for preview/download.
- Frontend components live in `Frontend/src/Components` and pages in `Frontend/src/Pages`.

Contributing

- Open an issue or PR. Keep changes small and focused. Add tests when feasible.

---

If you want, I can also add `backend/.env.example` and `Frontend/.env.example` with placeholders. Just say the word and I'll add them.
# FS-Java-MiniProject