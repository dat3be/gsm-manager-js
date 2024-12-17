const express = require('express');
const { generateToken } = require('../middleware/jwtAuth');
const router = express.Router();

router.post('/login', generateToken);

module.exports = router;
