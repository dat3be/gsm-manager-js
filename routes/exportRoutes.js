const express = require('express');
const { exportToJSON, exportToCSV } = require('../controllers/exportController');
const { verifyRole } = require('../middleware/jwtAuth');
const router = express.Router();

router.get('/export/json', verifyRole('admin'), exportToJSON);
router.get('/export/csv', verifyRole('admin'), exportToCSV);
router.get('/export/excel', verifyRole('admin'), exportToExcel);

module.exports = router;
