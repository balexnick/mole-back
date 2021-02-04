const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(200).json({ auth: 'error', message: 'No token provided.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, err => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }
    next();
  });
}

const createToken = data => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
};

module.exports = { verifyToken, createToken }