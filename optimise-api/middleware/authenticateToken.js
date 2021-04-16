const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) return res.status(401).send('missing token');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('invalid token supplied');
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;