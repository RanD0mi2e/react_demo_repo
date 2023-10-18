const WebSocket = require("ws");
const http = require("http");
const express = require("express");

const app = express();

// 创建一个HTTP服务器
const server = http.createServer(app);

// 存储每个客户端标识
const clients = new Map();

// 创建WebSocket服务器并将其附加到HTTP服务器
const wss = new WebSocket.Server({ noServer: true });

// 生成唯一的客户端标识符
function generateClientId() {
  return Math.random().toString(36).substring(7);
}

// 服务器监听升级事件
server.on("upgrade", (request, socket, head) => {
  switch (request.url) {
    case "/ws":
      wss.handleUpgrade(request, socket, head, (ws) => {
        Socket = socket;
        wss.emit("connection", ws, request);
      });
      break;
    default:
      break;
  }
});

// 监听websocket连接事件
wss.on("connection", (socket, request) => {
  // 获取客户端的唯一标识符
  const clientId = generateClientId();
  // 将客户端标识符存储在映射中
  clients.set(clientId, socket);
  socket.send(JSON.stringify({ identifier: clientId, type: "init" }));

  // 获取客户端ip
  const clientIP = request.socket.remoteAddress;
  // 监听客户端发送的消息
  socket.on("message", async (message) => {
    const { identifier, data, type } = JSON.parse(message);
    clients.forEach((client) => {
      if (client._readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            ip: clientIP,
            identifier,
            data,
          })
        );
      }
    });
  });
  wss.on("error", (message) => {
    console.log("报错了");
  });
  wss.on("close", (message) => {
    console.log("连接关闭：");
    // 移除客户端的标识符
    clients.delete(clientId);
  });
  wss.on("open", (message) => {
    console.log("open", message);
  });
});


server.listen(3001, () => {
    console.log('HTTP服务器已启动，监听端口3001')
})
