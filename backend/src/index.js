require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors(), express.json());
app.use('/api', require('./routes'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error del servidor' });
});

app.listen(process.env.PORT || 3000, () => console.log('API lista'));
