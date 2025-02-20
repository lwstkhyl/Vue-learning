const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { SECRET_KEY } = require('../config/constants');

const auth = (roles = []) => async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).send('Access denied');

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user || (roles.length && !roles.includes(user.role))) {
            return res.status(403).send('Permission denied');
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }
};

module.exports = auth;
