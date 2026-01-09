const path = require('path');
const express = require('express');
const app = express();

// JSON body parsing
app.use(express.json());

// Redirect root to US menu
app.get('/', (req, res) => {
  res.redirect('/us/');
});

// API route using the provided handler
const wheelHandler = require(path.join(__dirname, 'api', 'wheel-global.js'));
app.all('/api/wheel-global', (req, res) => wheelHandler(req, res));

// Serve static files (index.html and assets) from project root
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


