const jwt = require('jsonwebtoken');

const jwtKey = 'yourSecretKey';

const fetchUser = (req, res, next) => {
    const token = req.headers['authtoken'];

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
