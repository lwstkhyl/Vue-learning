const express = require('express');
const history = require('connect-history-api-fallback');
const app = express();
app.use(history());
app.use(express.static(__dirname + '/static_history'));
app.listen(5001, err => {
    if (!err) console.log('服务器启动成功');
});
