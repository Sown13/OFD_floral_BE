// server.js
const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
const http = require("http");

// Import the routes from controllers
const { initSocket } = require("./controller/SocketController");
const {
    floralController,
    floralControllerRoute,
} = require("./controller/FloralController");
const {
    userController,
    userControllerRoute,
} = require("./controller/UserInfoController");
const {
    categoryController,
    categoryControllerRoute,
} = require("./controller/CategoryController");
const {
    cartController,
    cartControllerRoute,
} = require("./controller/CartController");

// Middleware
app.use(express.json());
app.use(cors());

const prefixVersion = "/api/v1";
app.use(prefixVersion + floralControllerRoute, floralController);
app.use(prefixVersion + userControllerRoute, userController);
app.use(prefixVersion + categoryControllerRoute, categoryController);
app.use(prefixVersion + cartControllerRoute, cartController);

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io
initSocket(server);

app.get("/", (req, res) => {
    res.send("Welcome to the Online Floral Delivery");
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});