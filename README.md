# Personal Book Manager


## Features

### Authentication
- Secure **sign up / log in / log out** with JWT
- Passwords hashed with **bcryptjs** (12 salt rounds)
- Protected API routes via middleware
- Token stored in `localStorage`, sent as `Bearer` header

### Book Collection
- **Add books** with title, author, tags, status, notes, and color
- **Edit** any field inline — no page reload
- **Delete** books from your collection
- **Filter** by reading status or tag
- **Search** by title or author in real time

### Reading Statuses
| Status | Meaning |
|--------|---------|
| Want to Read | Books on your wishlist |
| Reading | Currently in progress |
| Completed | Books you've finished |

### Dashboard
- **3-stat summary** — Want to Read / Reading / Completed counts
- Click any stat card to filter the list instantly
- **Tag cloud** with usage counts
- Elegant empty state to guide new users

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + custom CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Validation | express-validator |
| Password hashing | bcryptjs |

---

## Project Structure

```
bookmanager/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with bcrypt hooks
│   │   └── Book.js          # Book schema with indexes
│   ├── routes/
│   │   ├── auth.js          # POST /signup, POST /login, GET /me
│   │   └── books.js         # Full CRUD + stats endpoint
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── server.js            # Express app entry point
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.js           # Landing page
    │   ├── layout.js         # Root layout
    │   ├── globals.css       # Design system + animations
    │   ├── auth/
    │   │   ├── login/page.js
    │   │   └── signup/page.js
    │   └── dashboard/
    │       ├── layout.js
    │       └── page.js       # Main dashboard
    ├── components/
    │   ├── AuthProvider.js   # React context for auth state
    │   ├── BookCard.js       # Book display + inline edit
    │   └── AddBookModal.js   # Add book form modal
    ├── lib/
    │   └── api.js            # API client (fetch wrapper)
    ├── .env
    ├── next.config.js
    ├── tailwind.config.js
    └── package.json
```
## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/shayanchakraborty18/bookmanager-backend.git
cd bookmanager-backend

git clone https://github.com/shayanchakraborty18/bookmanager-frontend.git
cd bookmanager-frontend
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

`.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://webdevbyshayan:3m5Fcj2lJ1lvjo6H@postaway.foi6hoz.mongodb.net/bookmanager?appName=postaway
JWT_SECRET=secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

### 3. Set up the Frontend

`.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app

Visit **[http://localhost:3000](http://localhost:3000)**

---

## API Reference

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | `{ name, email, password }` | Register new user |
| POST | `/api/auth/login` | `{ email, password }` | Login, returns JWT |
| GET | `/api/auth/me` | — | Get current user (auth required) |

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books (supports `?status=` and `?tag=`) |
| GET | `/api/books/stats` | Dashboard stats (counts + tag list) |
| POST | `/api/books` | Add a new book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

---


