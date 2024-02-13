const express = require('express');  
const cors = require('cors');
const CustomerAuth = require('./Routes/CustomerAuth');
const Admin = require('./Routes/AdminAuth');
const AdminPurpose = require('./Routes/AdminPurpose');
const SpecifiCustomer = require('./Routes/CustomerSpecific');
const DBquerry = require('./Routes/DBQuerries');
const cookieParser = require('cookie-parser');

const app = express();  

const PORT = process.env.PORT || 4000;  

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Customer login and Signup
app.use('/api', CustomerAuth);
//Admin login and Signup
app.use('/api', Admin );
//for admin purpose to get all detials
app.use('/api', AdminPurpose)
//for getting one customer details
app.use('/api', SpecifiCustomer)
// for updating and other querries/filter purpose
app.use('/api', DBquerry)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
