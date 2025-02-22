const express = require('express');
const { Cart } = require('../database/db-config');
const { Floral } = require('../database/db-config');
const { UserInfo } = require('../database/db-config');
const cartController = express.Router();
const cartControllerRoute = "/cart";

// Add floral to cart
cartController.post('/:userId/add', async (req, res) => {
    try {
        const { floralId, quantity } = req.body;
        const userId = req.params.userId;

        const user = await UserInfo.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const floral = await Floral.findById(floralId);
        if (!floral) return res.status(404).json({ message: 'Floral not found' });

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.floralId === floralId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ floralId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
});
// View cart
cartController.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

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