const mssql = require('mssql');

// SQL Server configuration
const config = {
    user: 'admin',
    password: 'Kahna786',
    server: 'indainhouseresturnat.cbu4yk40evr6.eu-north-1.rds.amazonaws.com',
    database: 'IndianResturant',
    options: {
      encrypt: true, // Use this if you're on Windows Azure
      trustServerCertificate: true, 
    },
  };
  
  // Create a SQL Server connection pool
  const pool = new mssql.ConnectionPool(config);
  const poolConnect = pool.connect();
  
  poolConnect.then(() => {
    console.log('Connected to SQL Server');
  }).catch((err) => {
    console.error('Error connecting to SQL Server:', err);
  });

module.exports = {
    mssql,
    pool,
};