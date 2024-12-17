const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

exports.generateToken = (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send({ error: 'Username is required' });

  const token = jwt.sign({ username, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
  res.status(200).send({ token });
};

exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid token.' });
  }
};
