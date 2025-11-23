/**
 * Validate request body fields
 */
const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
};

/**
 * Validate email format
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
  }

  next();
};

/**
 * Validate password strength
 */
const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }
  }

  next();
};

/**
 * Validate username format
 */
const validateUsername = (req, res, next) => {
  const { username } = req.body;

  if (username) {
    const usernameRegex = /^[a-z0-9._-]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        error: "Username can only contain lowercase letters, numbers, dots, hyphens, and underscores",
      });
    }
    if (username.length < 3) {
      return res.status(400).json({
        error: "Username must be at least 3 characters long",
      });
    }
    if (username.length > 30) {
      return res.status(400).json({
        error: "Username must be less than 30 characters",
      });
    }
    // Prevent usernames starting or ending with dots/hyphens
    if (/^[.-]|[.-]$/.test(username)) {
      return res.status(400).json({
        error: "Username cannot start or end with dots or hyphens",
      });
    }
  }

  next();
};

module.exports = {
  validateFields,
  validateEmail,
  validatePassword,
  validateUsername,
};
