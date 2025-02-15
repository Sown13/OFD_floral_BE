// controller.js
const express = require('express');
const { UserInfo } = require('../database/db-config');
const userController = express.Router();
const userControllerRoute = "/users";

// import middleware
const UserInfoMiddleware = require('../middleware/UserInfoMiddleWare');

/** Get all users */
userController.get('', async (req, res) => {
    try {
        const userList = await UserInfo.find();
        res.json(userList);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error });
    }
});


/** Find user by ID */
userController.get('/:id', async (req, res) => {
    try {
        const user = await UserInfo.findById(req.params.id);
        if (!user) return res.status(404).json({
            message: 'Người dùng không tồn tại'
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm người dùng', error });
    }
});

/** Create new user */
userController.post('',
    UserInfoMiddleware.validateRequiredFields,
    UserInfoMiddleware.validateUniqueUser,
    UserInfoMiddleware.validatePasswordStrength,
    async (req, res) => {
        try {
            const newUser = new UserInfo(req.body);
            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: 'Lỗi khi tạo người dùng', error });
        }
    });

/** Edit user */
userController.put('/:id', async (req, res) => {
    try {
        const updatedUser = await UserInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'Người dùng không tồn tại' });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật người dùng', error });
    }
});

/** Delete user */
userController.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await UserInfo.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'Người dùng không tồn tại' });
        res.json({ message: 'Người dùng đã bị xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa người dùng', error });
    }
});

module.exports = {
    userController,
    userControllerRoute
}
