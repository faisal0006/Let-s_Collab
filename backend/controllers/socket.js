const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Store active users per board
const boardRooms = new Map();

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a specific board room
    socket.on("join-board", async (data) => {
      try {
        const { boardId, userId, userName } = data;

        if (!boardId || !userId) {
          socket.emit("error", { message: "Board ID and User ID are required" });
          return;
        }

        // Verify user has access to this board
        const board = await prisma.board.findUnique({
          where: { id: boardId },
          include: {
            collaborators: {
              where: { userId: userId },
            },
          },
        });

        if (!board) {
          socket.emit("error", { message: "Board not found" });
          return;
        }

        const isOwner = board.ownerId === userId;
        const isCollaborator = board.collaborators.length > 0;

        if (!isOwner && !isCollaborator) {
          socket.emit("error", { message: "Access denied to this board" });
          return;
        }

        // Join the board room
        socket.join(boardId);
        socket.boardId = boardId;
        socket.userId = userId;
        socket.userName = userName;

        // Track active users in this board
        if (!boardRooms.has(boardId)) {
          boardRooms.set(boardId, new Map());
        }
        
        const boardUsers = boardRooms.get(boardId);
        boardUsers.set(socket.id, {
          userId,
          userName,
          socketId: socket.id,
          joinedAt: Date.now(),
        });

        // Get list of active users for this board (unique by userId to prevent duplicates)
        const uniqueUsers = new Map();
        boardUsers.forEach((user) => {
          uniqueUsers.set(user.userId, user);
        });
        const activeUsers = Array.from(uniqueUsers.values());

        // Notify all users in the board about the new user
        io.to(boardId).emit("user-joined", {
          userId,
          userName,
          socketId: socket.id,
          activeUsers,
        });

        console.log(`User ${userName} (${userId}) joined board ${boardId}`);
      } catch (error) {
        console.error("Error joining board:", error);
        socket.emit("error", { message: "Failed to join board" });
      }
    });

    // Handle element updates (drawing, shapes, etc.)
    socket.on("element-update", (data) => {
      try {
        const { boardId, elements, userId } = data;

        if (!boardId || !socket.boardId || socket.boardId !== boardId) {
          return;
        }

        // Broadcast to all other users in the board
        socket.to(boardId).emit("element-update", {
          elements,
          userId,
          socketId: socket.id,
        });
      } catch (error) {
        console.error("Error handling element update:", error);
      }
    });

    // Handle cursor movement
    socket.on("cursor-move", (data) => {
      try {
        const { boardId, x, y, userName } = data;

        if (!boardId || !socket.boardId || socket.boardId !== boardId) {
          return;
        }

        // Broadcast cursor position to all other users in the board
        socket.to(boardId).emit("cursor-move", {
          userId: socket.userId,
          userName: userName || socket.userName,
          socketId: socket.id,
          x,
          y,
        });
      } catch (error) {
        console.error("Error handling cursor move:", error);
      }
    });

    // Handle board title update
    socket.on("title-update", (data) => {
      try {
        const { boardId, title } = data;

        if (!boardId || !socket.boardId || socket.boardId !== boardId) {
          return;
        }

        // Broadcast title update to all other users in the board
        socket.to(boardId).emit("title-update", {
          title,
          userId: socket.userId,
        });
      } catch (error) {
        console.error("Error handling title update:", error);
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      try {
        const boardId = socket.boardId;
        const userId = socket.userId;
        const userName = socket.userName;

        if (boardId && boardRooms.has(boardId)) {
          const boardUsers = boardRooms.get(boardId);
          boardUsers.delete(socket.id);

          // If no users left in the board, clean up
          if (boardUsers.size === 0) {
            boardRooms.delete(boardId);
          } else {
            // Notify remaining users (unique by userId)
            const uniqueUsers = new Map();
            boardUsers.forEach((user) => {
              uniqueUsers.set(user.userId, user);
            });
            const activeUsers = Array.from(uniqueUsers.values());
            io.to(boardId).emit("user-left", {
              userId,
              userName,
              socketId: socket.id,
              activeUsers,
            });
          }

          console.log(`User ${userName} (${userId}) left board ${boardId}`);
        }

        console.log("User disconnected:", socket.id);
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });

    // Handle explicit leave-board event
    socket.on("leave-board", () => {
      try {
        const boardId = socket.boardId;
        const userId = socket.userId;
        const userName = socket.userName;

        if (boardId && boardRooms.has(boardId)) {
          const boardUsers = boardRooms.get(boardId);
          boardUsers.delete(socket.id);

          if (boardUsers.size === 0) {
            boardRooms.delete(boardId);
          } else {
            // Get unique users by userId
            const uniqueUsers = new Map();
            boardUsers.forEach((user) => {
              uniqueUsers.set(user.userId, user);
            });
            const activeUsers = Array.from(uniqueUsers.values());
            socket.to(boardId).emit("user-left", {
              userId,
              userName,
              socketId: socket.id,
              activeUsers,
            });
          }
        }

        socket.leave(boardId);
        socket.boardId = null;
        socket.userId = null;
        socket.userName = null;
      } catch (error) {
        console.error("Error leaving board:", error);
      }
    });
  });
};

module.exports = { initializeSocket };
