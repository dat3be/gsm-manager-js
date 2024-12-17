const express = require('express');
const { runUSSD } = require('../controllers/ussdController');
const { verifyToken } = require('../middleware/jwtAuth');
const router = express.Router();

router.post('/ussd', verifyToken, runUSSD);

module.exports = router;
