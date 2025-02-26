const express = require("express");
const { Cart } = require("../database/db-config");
const { Floral } = require("../database/db-config");
const { UserInfo } = require("../database/db-config");
const cartController = express.Router();
const cartControllerRoute = "/cart";
const { authenToken } = require("../middleware/LoginMiddleWare");

cartController.post("/add", authenToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const userExists = await UserInfo.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const items = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Invalid request. Items must be an array and cannot be empty.",
            });
        }

        let cart = new Cart({ userId, date: Date.now(), total: 0, items: [] });
        let totalCost = 0;
        for (const item of items) {
            const { floralId, quantity } = item;

            const quantityNumber = Number(quantity);
            if (isNaN(quantityNumber) || quantityNumber <= 0) {
                return res.status(400).json({
                    message: "Invalid quantity. It must be a positive number.",
                });
            }

            const floral = await Floral.findById(floralId).select("price quantity");
            if (!floral) {
                return res.status(404).json({ message: `Floral with ID ${floralId} not found` });
            }

            const finalQuantity = Math.min(quantityNumber, floral.quantity);
            floral.quantity = floral.quantity - finalQuantity;

            const itemCost = quantityNumber * floral.price;
            totalCost += itemCost;

            await floral.save();
            cart.items.push({ floralId, quantity: quantityNumber });
        }
        cart.total = totalCost;

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({
            message: "Error adding to cart",
            error: error.message,
        });
    }
});

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
cartController.get("/", authenToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const userExists = await UserInfo.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const carts = await Cart.find({ userId }).populate("items.floralId");
        if (!carts) return res.status(404).json({ message: "Cart not found" });
        const formattedCarts = carts.map((cart) => ({
            _id: cart._id,
            userId: cart.userId,
            date: cart.date,
            total: cart.total,
            items: cart.items.map((item) => ({
                floralId: item.floralId._id,
                name: item.floralId.name,
                price: item.floralId.price,
                quantity: item.quantity,
            })),
        }));
        res.json(formattedCarts);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving cart", error });
    }
});

module.exports = {
    cartController,
    cartControllerRoute,
};
