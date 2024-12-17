const db = require('../models/db');
const ExcelJS = require('exceljs');

exports.exportToExcel = (req, res) => {
  db.all(`SELECT * FROM ussd_logs ORDER BY timestamp DESC`, [], async (err, rows) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to fetch USSD logs.' });
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('USSD Logs');

      // Add columns
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 5 },
        { header: 'Port', key: 'port', width: 15 },
        { header: 'USSD Command', key: 'ussd_command', width: 20 },
        { header: 'Response', key: 'response', width: 50 },
        { header: 'Timestamp', key: 'timestamp', width: 20 }
      ];

      // Add rows
      rows.forEach((row) => worksheet.addRow(row));

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=ussd_logs.xlsx');

      // Write workbook to response
      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (excelError) {
      console.error('Failed to export Excel:', excelError.message);
      res.status(500).send({ error: 'Failed to export Excel.' });
    }
  });
};
