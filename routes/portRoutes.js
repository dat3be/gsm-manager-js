const express = require('express');
const { getPorts } = require('../controllers/portController');
const { verifyToken } = require('../middleware/jwtAuth');
const router = express.Router();

router.get('/ports', verifyToken, getPorts);

module.exports = router;
