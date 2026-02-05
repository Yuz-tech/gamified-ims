require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json({extended: false}));
app.use(cors());
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req,res) => {
    res.json({ msg: 'Web App API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});