const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const port = process.env.PORT || 5002; // Changed to 5002

// MongoDB Connection
mongoose.connect("mongodb+srv://Reddy:Reddy@cluster0.ot3jl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.get('/', (req, res) => res.send('Backend api for Learning Path'));

// Error handling for port in use
const server = app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy. Trying port ${port + 1}`);
        server.listen(port + 1);
    } else {
        console.error('Server error:', err);
    }
});