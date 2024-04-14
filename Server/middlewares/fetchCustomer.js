const jwt = require('jsonwebtoken');

const jwtKey = process.env.SECRET_KEY;

const fetchUser = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log("token:", token)
    if (!token) {
        return res.status(401).json({ error: 'Authentication failed: Token not found' });
    }

    try {
        const decodedToken = jwt.verify(token, jwtKey);
        req.user = decodedToken.userID;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }
};



module.exports = fetchUser;
