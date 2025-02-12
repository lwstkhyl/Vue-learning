const express = require('express');
const app = express();
app.use(express.static(__dirname + '/static_hash'));
app.listen(5000, err => {
    if (!err) console.log('服务器启动成功');
});
