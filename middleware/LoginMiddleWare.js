const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateLoginFields = (req, res, next) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({ message: "Tất cả các trường là bắt buộc"});
    }
    next();
}

function authenToken(req, res, next) {
    const authorizationClient = req.headers['authorization'];
    const token = authorizationClient && authorizationClient.split(' ') [1]

    if (!token) return res.sendStatus(401)
    
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded;
        next();
    } catch (e) {
        return res.sendStatus(403)
    }    
}


module.exports = {
    validateLoginFields,
    authenToken
}