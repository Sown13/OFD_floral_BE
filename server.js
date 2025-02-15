//server as disparcher servlet (front controller)
const express = require('express');
const app = express();
const PORT = 8080;

// Import the routes from controller.js
const { floralController, floralControllerRoute } = require('./controller/FloralController');
const { userController, userControllerRoute } = require('./controller/UserInfoController');

app.use(express.json());

// Use the imported routes
app.use(floralControllerRoute, floralController);
app.use(userControllerRoute, userController);

app.get('/', (req, res) => {
    res.send('Welcome to the Online Floral Delivery');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});