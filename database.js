const mysql = require('mysql2/promise'); // Using promises for a cleaner async approach

const pool = mysql.createPool({
  host: '127.0.0.1',  // Replace with your actual database host
  user: 'root',        // Replace with your actual database username
  password: '1234', // Replace with your actual database password (never store in plain text!)
  database: 'database_name' // Replace with your actual database name
});  // Enable promises for cleaner async handling

async function getUsers() {
  try {
    const [rows] = await pool.query('SELECT * FROM Users');
    return rows;
  } catch (error) {

    console.error('Error fetching users:', error);
    // Handle the error appropriately, like sending an alert or logging to a file
  }
}

async function getUser(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
    return rows[0] || null; // Return null if no user found for the given ID
  } catch (error) {
    console.error('Error fetching user:', error);
    // Handle the error appropriately
  }
}

async function createUser(username, password, confirmPassword) {
  try {
    // Validate user input to prevent potential security issues (e.g., length checks)
    // Implement password hashing using a secure library like bcrypt before storing

    const [result] = await pool.query('INSERT INTO Users (username, password, confirm_password) VALUES (?, ?, ?)', [username, password, confirmPassword]);
    return result.insertId; // Return the newly created user's ID
  } catch (error) {
    console.error('Error creating user:', error);
    // Handle the error appropriately, like sending an alert or logging details
  }
}

// Example usage
(async () => {
  try {
    const userId = await createUser('bac', '101', '101');
    console.log('New user ID:', userId);

    const users = await getUsers();
    console.log('All users:', users);

    const user = await getUser(1); // Replace 1 with the actual ID you want to fetch
    console.log('User with ID 1:', user); // Or replace 1 with the actual ID
  } catch (error) {
    console.error('Error in main function:', error);
    // Handle errors from any of the asynchronous calls here
  }
})();

const bcrypt = require('bcrypt');

async function updateUser(id, username, password, confirmPassword) {
  try {
    // Validate user input
    if (!username || !password || !confirmPassword) {
      throw new Error('Username, password, and confirm password are required.');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }
    // Additional validation checks can be added here

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Update user information in the database
    const [result] = await pool.query('UPDATE Users SET username = ?, password = ? WHERE id = ?', [username, hashedPassword, id]);
    return result.affectedRows; // Return the number of rows affected (should be 1 for successful update)
  } catch (error) {
    console.error('Error updating user:', error);
    // Handle the error appropriately, like sending an alert or logging details
  }
}

app.post('/updateUser', async (req, res) => {
  const { id, username, password, confirmPassword } = req.body;
  try {
    const affectedRows = await updateUser(id, username, password, confirmPassword);
    res.send(`Successfully updated ${affectedRows} user.`);
  } catch (error) {
    res.status(400).send(`Error updating user: ${error.message}`);
  }
});
