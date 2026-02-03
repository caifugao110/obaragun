const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { mockDb } = require('../config/database');
const { isAdmin } = require('../middleware/auth');

// 登录
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 查找用户
        const user = mockDb.findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }
        
        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }
        
        // 设置会话
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        
        res.status(200).json({ 
            message: '登录成功',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 注册（仅管理员）
router.post('/register', isAdmin, (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        // 检查是否已存在
        const existingUser = mockDb.findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }
        
        // 加密密码
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        // 创建用户
        const user = mockDb.createUser({
            username,
            password: hashedPassword,
            role: role || 'user'
        });
        
        res.status(201).json({ 
            message: '用户创建成功',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 退出登录
router.post('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('退出登录错误:', error);
            res.status(500).json({ message: '服务器内部错误' });
        } else {
            res.status(200).json({ message: '退出登录成功' });
        }
    });
});

// 检查登录状态
router.get('/status', (req, res) => {
    if (req.session.userId) {
        res.status(200).json({ 
            isLoggedIn: true,
            user: {
                id: req.session.userId,
                username: req.session.username,
                role: req.session.role
            }
        });
    } else {
        res.status(200).json({ isLoggedIn: false });
    }
});

module.exports = router;
