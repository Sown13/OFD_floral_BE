//define collection, connection to db here

const mongoose = require('mongoose');
const FloralSchema = require('../model/FloralSchema');
const UserSchema = require('../model/UserSchema');
const CategorySchema = require('../model/CategorySchema');
const CartSchema = require('../model/CartSchema');

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/ofd-floral', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Kết nối thành công với MongoDB'))
    .catch(err => console.error('Lỗi kết nối', err));

//define collection name here
const FloralSchemaWithCollection = new mongoose.Schema(FloralSchema, {collection: 'florals'});
const CategorySchemaWithCollection = new mongoose.Schema(CategorySchema, {collection: 'categories'});
const UserSchemaWithCollection = new mongoose.Schema(UserSchema, {collection: 'userInfos'});
const CartSchemaWithCollection = new mongoose.Schema(CartSchema, {collection: 'carts'});

//define model (feel like it server like a repository in java srping)
const Floral = mongoose.model('Floral', FloralSchemaWithCollection);
const Category = mongoose.model('Category', CategorySchemaWithCollection);
const UserInfo = mongoose.model('UserInfo', UserSchemaWithCollection);
const Cart = mongoose.model('Cart', CartSchemaWithCollection);

module.exports = {
    Floral,
    Category,
    UserInfo,
    Cart
}

