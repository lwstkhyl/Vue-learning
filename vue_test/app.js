const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');

const app = express();
const SECRET_KEY = 'your-secret-key';
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// 模拟用户数据库
const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' }
];

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));

// 鉴权中间件
const auth = (roles = []) => async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = users.find(u => u.id === decoded.id);

        if (!user || (roles.length && !roles.includes(user.role))) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    } catch (err) {
        res.sendStatus(401);
    }
};

// 登录接口
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) return res.sendStatus(401);

    const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

// 文件列表查询
app.get('/files', auth(), async (req, res) => {
    const listFiles = async (dirPath) => {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        return Promise.all(entries.map(entry => {
            const fullPath = path.join(dirPath, entry.name);
            return entry.isDirectory()
                ? { name: entry.name, type: 'directory', children: listFiles(fullPath) }
                : { name: entry.name, type: 'file', path: fullPath.replace(UPLOAD_DIR, '') };
        }));
    };

    try {
        const fileTree = await listFiles(UPLOAD_DIR);
        res.json(fileTree);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 文件上传（管理员）
app.post('/upload', auth(['admin']), async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files uploaded');
    }

    const processFile = async (file, filePath) => {
        const fullPath = path.join(UPLOAD_DIR, filePath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await file.mv(fullPath);
    };

    try {
        const files = Array.isArray(req.files.files)
            ? req.files.files
            : [req.files.files];

        await Promise.all(files.map(file =>
            processFile(file, file.name)
        ));

        res.send('Files uploaded');
    } catch (err) {
        res.status(500).send('Upload failed');
    }
});

// 文件删除（管理员）
app.delete('/files/*', auth(['admin']), async (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params[0]);

    try {
        const stats = await fs.stat(filePath);
        console.log(stats);
        // if (stats.isDirectory()) {
        //     await fs.rm(filePath, { recursive: true });
        // } else {
        //     await fs.unlink(filePath);
        // }
        res.send('Deleted successfully');
    } catch (err) {
        res.status(404).send('File not found');
    }
});

// 文件下载
app.get('/download/*', auth(), async (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params[0]);

    try {
        if (Array.isArray(req.query.files)) {
            const archive = archiver('zip');
            res.attachment('download.zip');
            archive.pipe(res);

            req.query.files.forEach(file => {
                archive.file(path.join(UPLOAD_DIR, file), { name: file });
            });

            archive.finalize();
        } else {
            res.download(filePath);
        }
    } catch (err) {
        res.status(404).send('File not found');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));