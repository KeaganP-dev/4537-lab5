const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Helper function to send a POST request
function sendPostRequest(hostname, path, postData, callback) {
  const options = {
    hostname: hostname,
    port: 443,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => callback(null, data));
  });

  req.on('error', (e) => callback(e));
  req.write(postData);
  req.end();
}

// Create server to serve the webpage and handle POST requests
http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Serve the HTML file
    if (req.url === '/' || req.url === '/index.html') {
      fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }

  if (req.method === 'POST') {
    // Handle specific POST requests
    if (req.url === '/api/submit-data') {
      // Simulate sending a specific POST request to an external service
      const postData = JSON.stringify({ data: 'Some specific data' });

      sendPostRequest('api.example.com', '/submit', postData, (err, apiResponse) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to send POST request' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(apiResponse);
        }
      });
    }

    // Handle SQL query submission
    else if (req.url === '/api/sql-query') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const parsedBody = JSON.parse(body);
        const sqlQuery = parsedBody.query;
        
        // Simulate query processing (just logging here)
        console.log(`Received SQL query: ${sqlQuery}`);

        const result = { success: true, message: `Query executed: ${sqlQuery}` };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      });
    }
  }
}).listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
