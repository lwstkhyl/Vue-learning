const http = require('http');
const server = http.createServer((request, response) => {
    response.setHeader('content-type', 'application/json;charset=utf-8'); //响应头--字符集
    const data = [
        {
            id: "001",
            name: 'abc',
            age: 18
        },
        {
            id: "002",
            name: 'bcd',
            age: 19
        },
        {
            id: "003",
            name: 'cde',
            age: 20
        },
    ]
    if (request.url === '/student') {
        response.end(JSON.stringify(data));
        console.log("server1收到请求");
    }
    response.end();
});
server.listen(5000, () => {
    console.log("服务已经启动");
});
