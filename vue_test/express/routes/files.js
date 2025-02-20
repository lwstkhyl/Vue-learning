const router = require('express').Router();

const auth = require('../middlewares/auth');

// 不需要鉴权的路由
router.get('/files', require('../utils/file').listFiles);
router.get('/stats', require('../utils/file').stats);
// 需要管理员权限的路由
router.post('/upload', auth(['admin']), require('../utils/file').uploadFiles);
router.post('/create', auth(['admin']), require('../utils/file').createDir);
router.delete('/files/*', auth(['admin']), require('../utils/file').deleteFile);

// 下载路由
router.get('/download/*', require('../utils/file').downloadFile);

module.exports = router;
