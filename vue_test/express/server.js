require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 数据库连接
connectDB();

//页面
app.use(express.static(__dirname + '/dist'));

// 中间件
app.use(cors());
app.use(express.json());
app.use(fileUpload({
    useTempFiles: false,       // 禁用临时文件
    safeFileNames: false,      // 禁用安全文件名过滤
    preserveExtension: true,   // 保留完整扩展名
    uriDecodeFileNames: true   // 关键：对文件名进行URI解码
}));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/files'));

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    require('./utils/init').createUploadDir(); // 创建上传目录
});
