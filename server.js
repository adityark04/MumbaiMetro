const http = require('http');
const path = require('path');

const port = 5500;

const server = http.createServer((req, res) => {
  // Serve static files from the project directory
  const filePath = path.join(__dirname, 'WP_Project', req.url); // Replace with your file path
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Handle errors
      res.statusCode = 404;
      res.end('Not found');
    } else {
      res.end(data);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
