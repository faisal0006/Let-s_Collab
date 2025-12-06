const express = require("express");
const router = express.Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { cacheMiddleware, invalidateCache } = require("../middleware/cache");

// Get current user (cached for 5 minutes)
router.get("/me", cacheMiddleware("user:me", 300), getCurrentUser);

// Update profile - invalidate cache
router.patch("/me", invalidateCache(["user:me:*"]), updateProfile);

module.exports = router;
