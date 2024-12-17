const db = require('../models/db');

exports.getPhoneNumbers = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default page 1
  const limit = parseInt(req.query.limit) || 10; // Default 10 records per page
  const offset = (page - 1) * limit;

  db.all(
    `SELECT * FROM phone_numbers ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, rows) => {
      if (err) {
        console.error('Error fetching phone numbers:', err.message);
        return res.status(500).send({ error: 'Failed to fetch phone numbers.' });
      }

      // Count total records for pagination metadata
      db.get(`SELECT COUNT(*) as total FROM phone_numbers`, [], (err, countRow) => {
        if (err) {
          console.error('Error counting records:', err.message);
          return res.status(500).send({ error: 'Failed to fetch count.' });
        }

        res.status(200).send({
          page,
          limit,
          total: countRow.total,
          data: rows,
        });
      });
    }
  );
};
