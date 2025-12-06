# Let's Collab 🎨

> A real-time collaborative whiteboard platform for teams, classrooms, and creative minds.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## 🎯 What is Let's Collab?

**Let's Collab** is a real-time collaborative whiteboard platform where users can create, organize, and share multiple whiteboards. Each board supports live drawing, sticky notes, shapes, text, and media — all synced instantly for every collaborator.

Perfect for remote teams, classrooms, designers, and anyone who needs a shared visual workspace.

## ✨ Key Features

### 🔐 Authentication & User Management
- Email/password and OAuth (Google) authentication
- JWT-based secure sessions
- User profiles with customizable avatars

### 📊 Whiteboard Management
- Create unlimited whiteboards
- Rename, delete, and organize boards
- Dashboard with board previews
- Quick search and filtering

### 🤝 Real-time Collaboration
- **Live sync** across all collaborators using Socket.IO
- **Permission levels**: Viewer, Editor, Owner
- **Invite collaborators** by username or email with role selection
- **Live cursors** showing collaborator positions and names
- **Presence indicators** for active users

### 🎨 Drawing & Design Tools
- Full-featured drawing powered by Excalidraw
- Shapes, lines, arrows, text, and sticky notes
- Color picker with custom palettes
- Undo/redo support
- Zoom and pan controls
- Export to PNG and SVG formats

### 💾 Data Persistence
- Auto-save functionality
- Real-time synchronization
- Conflict resolution for simultaneous edits
- Persistent storage with MySQL

## 🛠️ Tech Stack

### Frontend
- **React** (v18) with **Vite** - Fast, modern development
- **Excalidraw** - Professional whiteboard canvas
- **Zustand** - Lightweight state management
- **TailwindCSS** & **Shadcn/ui** - Modern, responsive design
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** with **Express.js** - RESTful API
- **MySQL** with **Prisma ORM** - Type-safe database access
- **Socket.IO** - WebSocket-based real-time sync
- **Passport.js** - Authentication strategies
- **JWT** - Secure token-based auth

### Infrastructure
- **Vercel** - Frontend hosting
- **Railway** - Backend and database hosting
- **GitHub Actions** - CI/CD pipelines

## 🚀 Quick Start

Get up and running in 5 minutes:

```bash
# Clone the repository
git clone https://github.com/IronwallxR5/Let-s_Collab.git
cd Let-s_Collab

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables (see SETUP.md)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Run database migrations
cd backend
npx prisma migrate dev

# Start the application
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

**For detailed setup instructions, see [SETUP.md](SETUP.md)**

## 📸 Screenshots

### Dashboard
Manage all your whiteboards in one place with an intuitive interface.

### Whiteboard Editor
Collaborate in real-time with a full suite of drawing tools.

### Collaboration
See live cursors and invite team members with different permission levels.

## 📁 Project Structure

```
Let-s_Collab/
├── backend/              # Node.js + Express API
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── prisma/          # Database schema & migrations
│   ├── routes/          # API routes
│   └── utils/           # Helper functions
├── frontend/            # React + Vite app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts
│   │   ├── features/    # Feature modules
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API services
│   │   └── store/       # State management
│   └── public/          # Static assets
├── SETUP.md             # Setup instructions
├── CONTRIBUTING.md      # Contribution guidelines
└── README.md            # This file
```

## 🤝 Contributing

We love contributions! Whether it's bug reports, feature requests, or code contributions, we welcome them all.

**See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.**

Quick contribution steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Excalidraw](https://excalidraw.com/) - Amazing whiteboard library
- [Socket.IO](https://socket.io/) - Real-time engine
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- All our [contributors](https://github.com/IronwallxR5/Let-s_Collab/graphs/contributors)

---

<div align="center">
  <p>Made with ❤️ by the Let's Collab Team</p>
  <p>⭐ Star us on GitHub — it helps!</p>
  
  [Website](https://let-s-collab.vercel.app) • [Report Bug](https://github.com/IronwallxR5/Let-s_Collab/issues) • [Request Feature](https://github.com/IronwallxR5/Let-s_Collab/issues)
</div>
