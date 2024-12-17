const express = require('express');
const bodyParser = require('body-parser');
const portRoutes = require('./routes/portRoutes');
const ussdRoutes = require('./routes/ussdRoutes');
const jwtAuth = require('./middleware/jwtAuth');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Routes
app.post('/api/auth/login', jwtAuth.generateToken);
app.use('/api', portRoutes);
app.use('/api', ussdRoutes);

// Root
app.get('/', (req, res) => res.send('GSM Modem Manager API is running!'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
