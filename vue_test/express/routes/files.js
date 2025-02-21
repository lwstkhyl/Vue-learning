const router = require('express').Router();
const fileHandle = require('../utils/file');
const auth = require('../middlewares/auth');

// 不需要鉴权的路由
router.get('/files', fileHandle.listFiles);
router.get('/stats', fileHandle.stats);
// 需要管理员权限的路由
router.post('/upload', auth(['admin']), fileHandle.uploadFiles);
router.post('/create', auth(['admin']), fileHandle.createDir);
router.delete('/files/*', auth(['admin']), fileHandle.deleteFile);

// 下载路由
router.get('/download/*', fileHandle.downloadFile);

module.exports = router;
