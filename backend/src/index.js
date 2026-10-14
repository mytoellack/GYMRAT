require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors(), express.json());
app.use((req, res, next) => { req.body ??= {}; next(); });

app.use('/api/v1', require('./routes'));

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log('API lista'));
