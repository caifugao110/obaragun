// 密码验证脚本
const bcrypt = require('bcryptjs');

// 测试密码
const password = 'admin123';
const hashedPassword = '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW';

// 验证密码
const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
console.log(`密码验证结果: ${isPasswordValid}`);

// 生成新的密码哈希
const newHashedPassword = bcrypt.hashSync(password, 10);
console.log(`新的密码哈希: ${newHashedPassword}`);
