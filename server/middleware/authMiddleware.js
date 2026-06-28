const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  
  let token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    if (token.startsWith('Bearer ')) {
      const parts = token.split(' ');
      if (parts.length !== 2) {
        return res.status(401).json({ msg: 'Token format is "Bearer <token>"' });
      }
      token = parts[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
        next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ msg: 'Token is not valid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Access denied: Role '${req.user ? req.user.role : 'unknown'}' is not authorized` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };