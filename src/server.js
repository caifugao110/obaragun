const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const { mockDb } = require('./config/database');
const { cacheControl, requestTime } = require('./middleware/performance');

// 导入路由
const authRoutes = require('./routes/auth');
const gunRoutes = require('./routes/gun');
const downloadRoutes = require('./routes/download');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'obara_gun_selection_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// 性能优化中间件
app.use(cacheControl);
app.use(requestTime);

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/gun', gunRoutes);
app.use('/api/download', downloadRoutes);

// 前端页面路由
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 初始化模拟数据库
console.log('初始化模拟数据库...');
mockDb.initData();
console.log('模拟数据库初始化成功');

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
