//server as disparcher servlet (front controller)
const express = require('express');
const app = express();
const PORT = 8080;

// Import the routes from controller.js
const { floralController, floralControllerRoute } = require('./controller/FloralController');
const { userController, userControllerRoute } = require('./controller/UserInfoController');
const { categoryController, categoryControllerRoute } = require('./controller/CategoryController');
const { cartController, cartControllerRoute } = require('./controller/CartController');

app.use(express.json());
const cors = require('cors');
app.use(cors()); // Mặc định cho phép tất cả nguồn truy cập


const prefixVersion = "/api/v1";
// Use the imported routes
app.use(prefixVersion + floralControllerRoute, floralController);
app.use(prefixVersion + userControllerRoute, userController);
app.use(prefixVersion + categoryControllerRoute, categoryController);
app.use(prefixVersion + cartControllerRoute, cartController);

app.get('/', (req, res) => {
    res.send('Welcome to the Online Floral Delivery');
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});