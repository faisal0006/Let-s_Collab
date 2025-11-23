// Socket.IO Configuration

module.exports = {
  // Socket events
  EVENTS: {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    JOIN_BOARD: "join-board",
    LEAVE_BOARD: "leave-board",
    ELEMENT_UPDATE: "element-update",
    CURSOR_MOVE: "cursor-move",
    TITLE_UPDATE: "title-update",
    USER_JOINED: "user-joined",
    USER_LEFT: "user-left",
    ERROR: "error",
  },

  // CORS configuration
  CORS_OPTIONS: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },

  // Throttle settings (in milliseconds)
  THROTTLE: {
    CURSOR_UPDATE: 100,
    ELEMENT_UPDATE: 300,
  },
};
