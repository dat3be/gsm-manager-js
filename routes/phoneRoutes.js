const express = require('express');
const { getPhoneNumbers } = require('../controllers/phoneController');
const router = express.Router();

router.get('/phone-numbers', getPhoneNumbers);

module.exports = router;
