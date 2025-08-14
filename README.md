# Resona Music Player

A modern, secure music streaming application built with React and Node.js.

## Features

- **User Authentication** - Secure JWT-based login/registration
- **Music Library** - Upload, organize and stream your music collection  
- **Admin Panel** - User management and system administration
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Streaming** - High-quality audio playback

## Tech Stack

**Frontend:** React 19, Vite, TailwindCSS  
**Backend:** Node.js, Express, MongoDB  
**Deployment:** Vercel (frontend), Railway (backend)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Installation

1. Clone the repository
```bash
git clone https://github.com/lazys0ul/Basic-project-3---Music-Player.git
cd Basic-project-3---Music-Player
```

2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm start
```

3. Frontend Setup
```bash
cd frontend  
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_SECRET_CODE=your_admin_registration_code
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Music
- `GET /api/music` - Get all music
- `POST /api/music/add-music` - Upload music (authenticated)
- `DELETE /api/music/:id` - Delete music (admin only)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)

## Deployment

### Live Application
- **Frontend:** https://resona-music.vercel.app
- **Backend:** https://basic-project-3-music-player-production.up.railway.app

### Deploy Your Own
1. **Backend (Railway):** Connect GitHub repo, set environment variables
2. **Frontend (Vercel):** Connect GitHub repo, set `VITE_API_URL` to your backend URL

## Security Features

- Password hashing with bcrypt
- JWT token authentication with blacklisting
- Input sanitization and validation
- Rate limiting
- File upload restrictions
- CORS protection

## Project Structure

```
├── backend/          # Node.js API server
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Authentication, validation
│   ├── models/       # MongoDB schemas
│   └── routes/       # API routes
├── frontend/         # React application
│   ├── components/   # Reusable UI components
│   ├── context/      # State management
│   └── utils/        # Helper functions
└── scripts/          # Development utilities
```

## License

MIT License - see [LICENSE](LICENSE) for details.
