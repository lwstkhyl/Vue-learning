const http = require('http');
const server = http.createServer((request, response) => {
    response.setHeader('content-type', 'application/json;charset=utf-8'); //响应头--字符集
    const data = [
        {
            id: "001",
            name: 'ABC',
            price: 180
        },
        {
            id: "002",
            name: 'BCD',
            price: 190
        },
        {
            id: "003",
            name: 'CDE',
            price: 200
        },
    ]
    if (request.url === '/cars') {
        response.end(JSON.stringify(data));
        console.log("server2收到请求");
    }
    response.end();
});
server.listen(5001, () => {
    console.log("服务已经启动");
});
