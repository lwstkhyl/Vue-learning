const fs = require('fs').promises;
const { UPLOAD_DIR } = require('../config/constants');

exports.createUploadDir = async () => {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        console.log('Upload directory created');
    }
};
