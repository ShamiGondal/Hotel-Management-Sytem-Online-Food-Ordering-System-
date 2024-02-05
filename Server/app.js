const express = require('express');  
const cors = require('cors');
const CustomerAuth = require('./Routes/CustomerAuth');

const app = express();  

const PORT = process.env.PORT || 4000;  

app.use(express.json());
app.use(cors());

app.use('/api', CustomerAuth);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
