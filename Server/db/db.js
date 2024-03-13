const mssql = require('mysql2'); 

// MySQL configuration
const config = {
  host: 'mysql-2811befd-ehtishamahmedgondal-2e51.a.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_18ggI1QCsI6RL04fiWd',
  database: 'IndianHouseRestaurant',
  port: 27205,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // Disable SSL rejection
  }
};

// Create a MySQL connection pool
const pool = mssql.createPool(config);

// Ensure connection to MySQL
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  connection.release(); // Release the connection
});

module.exports = {
  mssql,
  pool,
};
