const express = require('express');
const { Cart } = require('../database/db-config');
const { Floral } = require('../database/db-config');
const { UserInfo } = require('../database/db-config');
const cartController = express.Router();
const cartControllerRoute = "/cart";
const { authenToken } = require('../middleware/LoginMiddleWare');


const LoginMiddleware = require('../middleware/LoginMiddleWare');
// Add floral to cart
cartController.post('/add', LoginMiddleware.authenToken, async (req, res) => {
    console.log("vào đây");
    try {
        // const user = await UserInfo.findById(decoded.userId).select('-password');
        const user = req.user;
        console.log("user -----", user)
        const items = req.body; // Nhận danh sách sản phẩm từ body
        const userId = user.username;
        console.log("userId -----", userId)

        // const user = await UserInfo.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Lặp qua danh sách sản phẩm và thêm vào giỏ
        for (const { floralId, quantity } of items) {
            const floral = await Floral.findById(floralId);
            if (!floral) {
                return res.status(404).json({ message: `Floral with ID ${floralId} not found` });
            }

            const existingItem = cart.items.find(item => item.floralId.toString() === floralId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ floralId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        console.error('Error adding items to cart:', error);
        res.status(500).json({ message: 'Error adding items to cart', error: error.message });
    }
});

// View cart
cartController.get('/', authenToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Use userId from the token

        const cart = await Cart.findOne({ userId }).populate('items.floralId');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error });
    }
});

module.exports = {
    cartController,
    cartControllerRoute
};