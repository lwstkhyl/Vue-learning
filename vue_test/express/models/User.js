const mongoose = require('mongoose');
const md5 = require('md5'); // 新增MD5依赖

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

// 修改密码处理中间件
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = md5(this.password); // MD5加密
    next();
});

// 修改密码验证方法
userSchema.methods.comparePassword = function (password) {
    return password === this.password;
    // return md5(password) === this.password;
};

module.exports = mongoose.model('User', userSchema);
