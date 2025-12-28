const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Get token from header
  let token = req.header('Authorization');

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 3. Robust "Bearer " prefix removal
    if (token.startsWith('Bearer ')) {
      // Split by space and take the second part
      const parts = token.split(' ');
      if (parts.length !== 2) {
        return res.status(401).json({ msg: 'Token format is "Bearer <token>"' });
      }
      token = parts[1];
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach decoded payload to request
    // Ensure this matches your login payload (you used { id: user._id, role: user.role })
    req.user = decoded; 
    
    // IMPORTANT: Call next() only if verification succeeds
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ msg: 'Token is not valid or expired' });
  }
};

// Check if user has the required role
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if req.user exists (from protect) and has the required role
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Access denied: Role '${req.user ? req.user.role : 'unknown'}' is not authorized` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };