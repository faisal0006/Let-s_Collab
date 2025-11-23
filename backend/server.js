const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./config/passport");
const route = require("./routes");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { initializeSocket } = require("./controllers/socket");

const app = express();
const httpServer = createServer(app);
const PORT = 3000;

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Session middleware for passport
app.use(
  session({
    secret: process.env.JWT_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", route);

// Initialize Socket.IO handlers
initializeSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Socket.IO server running`);
});
