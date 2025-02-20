const fs = require('fs').promises;
const path = require('path');
const zip = require('express-zip');
const dayjs = require('dayjs');
const { UPLOAD_DIR } = require('../config/constants');

exports.listFiles = async (req, res) => {
    try {
        const currentPath = req.query.path || '';
        const safePath = path.normalize(currentPath).replace(/^(\.\.(\/|\\|$))+/g, '').trim();
        let fullPath = path.join(UPLOAD_DIR, safePath);
        // 验证路径合法性
        if (!fullPath.startsWith(UPLOAD_DIR)) {
            return res.status(400).send('Invalid path');
        }
        fullPath = '.\\' + fullPath;
        const list = await fs.readdir(fullPath, { encoding: 'utf8', withFileTypes: true });
        const files = await Promise.all(list.map(async entry => {
            const detailInfo = await fs.stat(path.join(fullPath, entry.name));
            return {
                name: entry.name,
                type: entry.isDirectory() ? 'directory' : 'file',
                path: path.join(safePath, entry.name).replace(/\\/g, '/'), // 统一使用正斜杠
                parent: safePath,
                size: detailInfo.size,
                ctimeMs: detailInfo.ctimeMs
            }
        }));
        const dic_files = files.filter(file => file.type === 'directory');
        const normal_files = files.filter(file => file.type !== 'directory');
        res.json({
            currentPath: safePath,
            files: [...dic_files, ...normal_files],
        });
    } catch (err) {
        res.status(404).send('Path not found');
    }
};

exports.uploadFiles = async (req, res) => {
    if (!req.files || !req.files.files) {
        return res.status(400).send('No files uploaded');
    }
    try {
        const currentPath = req.body.path || ''; // 获取前端传递的路径参数
        const safePath = path.normalize(currentPath).replace(/^(\.\.(\/|\\|$))+/g, '');
        const basePath = path.join(UPLOAD_DIR, safePath);
        // 解码中文路径
        const decodedBasePath = decodeURIComponent(basePath);
        if (!basePath.startsWith(UPLOAD_DIR)) { // 验证路径合法性
            return res.status(400).send('Invalid path');
        }
        const files = Array.isArray(req.files.files)
            ? req.files.files
            : [req.files.files];
        await Promise.all(files.map(async file => {
            // 解码文件名
            const decodedName = decodeURIComponent(file.name);
            const targetPath = path.join(decodedBasePath, decodedName);
            await fs.mkdir(path.dirname(targetPath), { encoding: 'utf8', recursive: true });
            await file.mv(targetPath);
        }));
        res.send('Files uploaded successfully');
    } catch (err) {
        res.status(500).send('Upload failed');
    }
};

exports.deleteFile = async (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params[0]);
    try {
        await fs.rm(filePath, { recursive: true, force: true });
        res.send('Deleted successfully');
    } catch (err) {
        res.status(404).send('File not found');
    }
};

exports.downloadFile = async (req, res) => {
    //防止连续下载
    if (!req.query.files) { //下载的是单个文件
        const filePath = path.join(UPLOAD_DIR, req.params[0]);
        try {
            res.download(filePath);
        } catch (err) {
            res.status(404).send('File not found');
        }
    } else { //下载多个文件
        res.zip(
            JSON.parse(req.query.files).map(file => {
                return {
                    path: path.join(UPLOAD_DIR, file),
                    name: file.split('/')[file.split('/').length - 1]
                }
            }),
            `download-${dayjs().format('YYYY-MM-DD HH-mm-ss')}.zip`
        );
        // const archive = archiver('zip');
        // res.attachment('download.zip');
        // archive.pipe(res);
        // const files = Array.isArray(req.query.files) ? req.query.files : [req.query.files];
        // files.forEach(file => {
        //     archive.file(path.join(UPLOAD_DIR, file), { name: file });
        // });
        // archive.finalize();
    }
}

exports.stats = async (req, res) => {
    const calcSize = async (dir) => {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        return Promise.all(entries.map(async entry => {
            const fullPath = path.join(dir, entry.name);
            return entry.isDirectory() ?
                calcSize(fullPath) :
                (await fs.stat(fullPath)).size;
        })).then(results =>
            results.flat(Infinity).reduce((sum, size) => sum + size, 0)
        );
    };
    try {
        const totalSize = await calcSize(UPLOAD_DIR);
        res.json({ totalSize });
    } catch (err) {
        res.status(500).send('统计失败');
    }
}

exports.createDir = async (req, res) => {
    try {
        const { folderPath, folderName } = req.body;
        // 路径安全验证
        const basePath = path.join(UPLOAD_DIR, folderPath || '');
        const safeBasePath = path.normalize(basePath).replace(/^(\.\.(\/|\\|$))+/g, '');
        // 验证路径是否合法
        if (!safeBasePath.startsWith(UPLOAD_DIR)) {
            return res.status(400).json({ error: '非法路径' });
        }
        const fullPath = path.join(safeBasePath, folderName);
        // 检查文件夹是否已存在
        try {
            await fs.access(fullPath);
            return res.status(409).json({ error: '文件夹已存在' });
        } catch {
            // 文件夹不存在，继续创建
        }
        // 创建文件夹
        await fs.mkdir(fullPath, { recursive: true });
        res.json({ message: '文件夹创建成功' });
    } catch (err) {
        res.status(500).json({ error: '文件夹创建失败' });
    }
}