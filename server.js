//server as disparcher servlet (front controller)
const express = require('express');
const app = express();
const PORT = 8080;
const cors = require("cors");

// Import the routes from controller.js
const { floralController, floralControllerRoute } = require('./controller/FloralController');
const { userController, userControllerRoute } = require('./controller/UserInfoController');

// cấu hình cors
app.use(cors());
app.use(express.json());

const prefixVersion = "/api/v1";
// Use the imported routes
app.use(prefixVersion + floralControllerRoute, floralController);
app.use(prefixVersion + userControllerRoute, userController);

app.get('/', (req, res) => {
    res.send('Welcome to the Online Floral Delivery');
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

