const { UserInfo } = require('../database/db-config');

const validateRequiredFields = (req, res, next) => {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc' });
    }
    next();
};

const validateUniqueUser = async (req, res, next) => {
    const { email, phone } = req.body;

    try {
        console.log("1");
        const userByEmail = await UserInfo.findOne({ email });
        if (userByEmail) {
            console.log("2");
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        console.log("3");
        const userByPhone = await UserInfo.findOne({ phone });
        if (userByPhone) {
            console.log("4");
            return res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
        }

        console.log("5");
        next();
    } catch (error) {
        console.log("6");
        res.status(500).json({ message: 'Lỗi kiểm tra người dùng', error });
    }
};

const validatePasswordStrength = (req, res, next) => {
    const { password } = req.body;

    // Check for minimum length and a mix of characters
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    if (!passwordStrengthRegex.test(password)) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số' });
    }

    next();
};

module.exports = {
    validateRequiredFields,
    validateUniqueUser,
    validatePasswordStrength
};