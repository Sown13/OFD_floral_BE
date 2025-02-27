// controller.js
const express = require("express");
const { UserInfo } = require("../database/db-config");
const userController = express.Router();
const userControllerRoute = "/users";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const randToken = require("rand-token");

// import middleware
const UserInfoMiddleware = require("../middleware/UserInfoMiddleWare");
const LoginMiddleware = require("../middleware/LoginMiddleWare");

userController.post(
    "/login",
    LoginMiddleware.validateLoginFields,
    // LoginMiddleware.authenToken,

    async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await UserInfo.findOne({ username });

            if (!user) return res.status(401).json({ message: "Sai username hoặc password." });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log("🔍 Kết quả so sánh mật khẩu:", isPasswordValid);

            if (!isPasswordValid)
                return res.status(401).json({ message: "Sai username hoặc password." });

            const accessToken = jwt.sign(
                { userId: user._id, username: user.username, role: user.role },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "1h",
                }
            );

            let refreshToken = user.refreshToken || randToken.generate(64);

            if (!user.refreshToken) {
                user.refreshToken = refreshToken;
                await user.save();
            }

            return res.json({
                message: "Đăng nhập thành công.",
                accessToken,
                refreshToken,
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error });
            console.log(error);
        }
    }
);
/**log out */

userController.post("/logout", async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "Không có refresh token" });
        }
        await UserInfo.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
        res.json({ message: "Đăng xuất thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

/**refresh Token */

userController.post("/refreshToken", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: "Không có refresh token" });
        }

        const user = await UserInfo.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ messaga: "Refresh token không hợp lệ" });
        }

        const newAccessToken = jwt.sign(
            { username: user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", err });
    }
});

/** Get all users */
userController.get("", async (req, res) => {
    try {
        const userList = await UserInfo.find();
        res.json(userList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error });
    }
});

/** Find user by ID */
userController.get("/:id", async (req, res) => {
    try {
        const user = await UserInfo.findById(req.params.id);
        if (!user)
            return res.status(404).json({
                message: "Người dùng không tồn tại",
            });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tìm người dùng", error });
    }
});

/** Create new user */
userController.post(
    "/signup",
    UserInfoMiddleware.validateRequiredFields,
    UserInfoMiddleware.validateUniqueUser,
    UserInfoMiddleware.validatePasswordStrength,
    async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            // const refreshToken = randToken.generate(64);

            const newUser = new UserInfo({
                ...req.body,
                password: hashedPassword,
                // refreshToken
            });
            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: "Lỗi khi tạo người dùng", error });
            console.log(error);
        }
    }
);

/** Edit user */
userController.put("/:id", async (req, res) => {
    try {
        const updatedUser = await UserInfo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi cập nhật người dùng", error });
    }
});

/** Delete user */
userController.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await UserInfo.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });
        res.json({ message: "Người dùng đã bị xóa" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa người dùng", error });
    }
});

module.exports = {
    userController,
    userControllerRoute,
};
