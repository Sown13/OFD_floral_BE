//define collection, connection to db here

const mongoose = require('mongoose');
const FloralSchema = require('../model/FloralSchema');
const UserSchema = require('../model/UserSchema');
const PredefineMessageSchema = require('../model/PredefineMessageSchema');

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/ofd-floral', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Kết nối thành công với MongoDB'))
    .catch(err => console.error('Lỗi kết nối', err));

//define collection name here
const FloralSchemaWithCollection = new mongoose.Schema(FloralSchema, { collection: 'florals' });
const PredefineMessageSchemaWithCollection = new mongoose.Schema(PredefineMessageSchema, { collection: 'predefineMessages' });
const UserSchemaWithCollection = new mongoose.Schema(UserSchema, { collection: 'userInfos' });

//define model (feel like it server like a repository in java srping)
const Floral = mongoose.model('Floral', FloralSchemaWithCollection);
const PredefineMessage = mongoose.model('PredefineMessage', PredefineMessageSchemaWithCollection);
const UserInfo = mongoose.model('UserInfo', UserSchemaWithCollection);

module.exports = {
    Floral,
    PredefineMessage,
    UserInfo
}

