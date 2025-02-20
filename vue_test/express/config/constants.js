require('dotenv').config();

module.exports = {
    SECRET_KEY: process.env.SECRET_KEY,
    UPLOAD_DIR: process.env.UPLOAD_DIR,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
};
