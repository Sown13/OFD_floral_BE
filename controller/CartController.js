const express = require('express');
const { Cart } = require('../database/db-config');
const { Floral } = require('../database/db-config');
const { UserInfo } = require('../database/db-config');
const cartController = express.Router();
const cartControllerRoute = "/cart";
const { authenToken } = require('../middleware/LoginMiddleWare');

//Sửa tạm cái này cho api của Hải (dùng mảng thay vì từng hoa) => giờ /cart/add chính là api thanh toán, còn get cart là get lịch sử mua hànghàng
cartController.post('/add', authenToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Use userId from the token
        const items = req.body; // Expecting an array of items

        // Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid request. Items must be an array and cannot be empty.' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        for (const item of items) {
            const { floralId, quantity } = item;

            // Validate quantity
            const quantityNumber = Number(quantity);
            if (isNaN(quantityNumber) || quantityNumber <= 0) {
                return res.status(400).json({ message: 'Invalid quantity. It must be a positive number.' });
            }

            const floral = await Floral.findById(floralId);
            if (!floral) {
                return res.status(404).json({ message: `Floral with ID ${floralId} not found` });
            }

            const existingItem = cart.items.find(i => i.floralId === floralId);
            if (existingItem) {
                existingItem.quantity += quantityNumber; // Update existing item quantity
            } else {
                cart.items.push({ floralId, quantity: quantityNumber }); // Add new item
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
});

// chỗ này mới đúng nhưng mà thôi
// cartController.post('/add', authenToken, async (req, res) => {
//     try {
//         const { floralId, quantity } = req.body;
//         const userId = req.user.userId; // Use userId from the token

//         // Validate quantity
//         const quantityNumber = Number(quantity);
//         if (isNaN(quantityNumber) || quantityNumber <= 0) {
//             return res.status(400).json({ message: 'Invalid quantity. It must be a positive number.' });
//         }

//         const floral = await Floral.findById(floralId);
//         if (!floral) return res.status(404).json({ message: 'Floral not found' });

//         let cart = await Cart.findOne({ userId });
//         if (!cart) {
//             cart = new Cart({ userId, items: [] });
//         }

//         const existingItem = cart.items.find(item => item.floralId === floralId);
//         if (existingItem) {
//             existingItem.quantity += quantityNumber; // Use the validated quantity
//         } else {
//             cart.items.push({ floralId, quantity: quantityNumber }); // Use the validated quantity
//         }

//         await cart.save();
//         res.status(200).json(cart);
//     } catch (error) {
//         console.error('Error adding to cart:', error);
//         res.status(500).json({ message: 'Error adding to cart', error: error.message });
//     }
// });

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