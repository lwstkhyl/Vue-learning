const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { SECRET_KEY, JWT_EXPIRES_IN } = require('../config/constants');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;