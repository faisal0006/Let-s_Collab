# Setup Guide 🛠️

Complete installation and configuration guide for Let's Collab.

---

### 📚 **[← Back to README](README.md)** · **[Contributing](CONTRIBUTING.md)** · **[API Docs](API.md)**

---

## Prerequisites

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **PostgreSQL** (v14.x or higher)
- **Git**

Verify installation:
```bash
node --version
npm --version
psql --version
```

## Quick Start

### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/IronwallxR5/Let-s_Collab.git
cd Let-s_Collab

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/lets_collab"
JWT_SECRET="your-secret-key-change-this-in-production"
FRONTEND_URL="http://localhost:5173"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
```

**Frontend** (`frontend/.env`):
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE lets_collab;
\q

# Run Prisma migrations
cd backend
npx prisma generate
npx prisma migrate dev
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## Additional Commands

### Database Management
```bash
cd backend

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database
npx prisma migrate reset

# Push schema changes
npx prisma db push
```

### Production Build
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### Database Connection Failed
- Start PostgreSQL: `brew services start postgresql` (macOS)
- Verify `DATABASE_URL` in `backend/.env`
- Test connection: `psql -U postgres`

### Prisma Client Error
```bash
cd backend
npx prisma generate
npm install
```

### CORS Errors
- Ensure `FRONTEND_URL` in `backend/.env` is `http://localhost:5173`
- Restart backend after changing `.env`

### Environment Variables Not Loading
- Restart dev servers after editing `.env` files
- Frontend variables must start with `VITE_`
- Check files are named `.env` not `.env.txt`

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Backend (Railway)
```env
DATABASE_URL="postgresql://user:pass@host:port/database"
FRONTEND_URL="https://your-app.vercel.app"
GOOGLE_CALLBACK_URL="https://your-api.railway.app/auth/google/callback"
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-api.railway.app
VITE_SOCKET_URL=https://your-api.railway.app
```

---

**Need help?** Check [GitHub Issues](https://github.com/IronwallxR5/Let-s_Collab/issues) or [Contributing Guide](CONTRIBUTING.md)
