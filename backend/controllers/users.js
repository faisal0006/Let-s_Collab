const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getUserFromToken(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

async function getCurrentUser(req, res) {
  try {
    const token = req.cookies.token;
    const decoded = getUserFromToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateProfile(req, res) {
  try {
    const token = req.cookies.token;
    const decoded = getUserFromToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, username } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const updateData = {
      name: name.trim(),
    };

    // If username is provided, validate and check uniqueness
    if (username && username.trim() !== "") {
      const usernameValue = username.trim().toLowerCase();
      
      // Validate username format
      const usernameRegex = /^[a-z0-9._-]+$/;
      if (!usernameRegex.test(usernameValue)) {
        return res.status(400).json({
          error: "Username can only contain lowercase letters, numbers, dots, hyphens, and underscores",
        });
      }
      
      if (usernameValue.length < 3 || usernameValue.length > 30) {
        return res.status(400).json({
          error: "Username must be between 3 and 30 characters",
        });
      }
      
      if (/^[.-]|[.-]$/.test(usernameValue)) {
        return res.status(400).json({
          error: "Username cannot start or end with dots or hyphens",
        });
      }

      // Check if username is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { username: usernameValue },
      });

      if (existingUser && existingUser.id !== decoded.id) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      updateData.username = usernameValue;
    }

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getCurrentUser,
  updateProfile,
};
