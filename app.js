const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const port = 5500;

// Serve static files from the 'public' directory (replace with your actual directory)
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// MySQL database configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'database_name'
});

// Route to handle POST requests to '/signin'
app.post('/signin', async (req, res) => {
  // Extract data from the request body
  const { username, password, confirmPassword } = req.body;

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Insert the data into the Users table
    const [result] = await connection.execute(
      'INSERT INTO Users (username, password, confirm_password) VALUES (?, ?, ?)',
      [username, password, confirmPassword]
    );

    // Release the connection
    connection.release();

    // Send a success response
    res.send('User Created successfully!');
    return res.redirect('/ticket_booking');
  } catch (error) {
    // Send an error response
    console.error('Error inserting data:', error);
    res.status(500).send('User already exists!');
  }
});

// Route to handle login request
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM Users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length > 0) {
      res.status(200).send('Login successful!');
      // Assuming successful login logic (e.g., valid credentials)'
      connection.release();
    } else {
      res.status(401).send('Invalid username or password');
    }

    await connection.release(); // Ensure release within try-catch
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal server error');
  }

});


app.post('/submit-ticket', async (req, res) => {
  // Extract data from the request body
  const { ticket_id, date_of_issue, time, validity, time_left, payment, gender, source, destination, price } = req.body;

  try {
      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Insert the data into the ticket table
      const [result] = await connection.execute(
          'INSERT INTO ticket (ticket_id, date_of_issue, time, validity, time_left, payment, gender, source, destination, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [ticket_id, date_of_issue, time, validity, time_left, payment, gender, source, destination, price]
      );

      // Release the connection
      connection.release();

      // Send a success response
      res.send('Ticket Created successfully!');
  } catch (error) {
      // Send an error response
      console.error('Error inserting ticket data:', error);
      res.status(500).send('Internal server error');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
