const express = require('express');
const app = express();
const port = 3000;

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Sample data
let data = [];

// GET method route
app.get('/data', (req, res) => {
  res.json(data);
});

// POST method route
app.post('/data', (req, res) => {
  const newData = req.body;
  data.push(newData);
  res.status(201).json(newData);
});

// POST method route for /login with validation
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate request body
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Process login
    res.status(200).json({ 
      message: 'Login successful', 
      username, 
      password 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!' 
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
