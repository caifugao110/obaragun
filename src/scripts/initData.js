const { sequelize } = require('../config/database');
const User = require('../models/User');
const Gun = require('../models/Gun');
const bcrypt = require('bcryptjs');

// 初始化数据
async function initData() {
    try {
        // 同步数据库
        await sequelize.sync({ force: true });
        console.log('数据库同步完成');
        
        // 创建管理员用户
        const adminPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            password: adminPassword,
            role: 'admin'
        });
        console.log('管理员用户创建完成');
        
        // 创建测试用户
        const userPassword = await bcrypt.hash('user123', 10);
        await User.create({
            username: 'user',
            password: userPassword,
            role: 'user'
        });
        console.log('测试用户创建完成');
        
        // 创建焊枪数据
        const guns = [
            {
                code: 'NOC-C1658',
                type: 'NOC',
                throatDepth: 280,
                throatWidth: 430,
                pressure: 30,
                workingStroke: 150,
                auxiliaryStroke: 3450,
                hangerType: '普通(A,G等)',
                cylinderType: '无给油',
                electrodeType: '握杆',
                imageUrl: 'img/NOC-C1658.png',
                cadUrl: 'downloads/NOC-C1658.cad',
                stepUrl: 'downloads/NOC-C1658.step'
            },
            {
                code: 'NOC-C1732',
                type: 'NOC',
                throatDepth: 170,
                throatWidth: 295,
                pressure: 25,
                workingStroke: 100,
                auxiliaryStroke: 3200,
                hangerType: 'BB',
                cylinderType: '无给油',
                electrodeType: '握杆',
                imageUrl: 'img/NOC-C1732.png',
                cadUrl: 'downloads/NOC-C1732.cad',
                stepUrl: 'downloads/NOC-C1732.step'
            },
            {
                code: 'NOC-C1733',
                type: 'NOC',
                throatDepth: 225,
                throatWidth: 338,
                pressure: 25,
                workingStroke: 100,
                auxiliaryStroke: 3200,
                hangerType: 'BB',
                cylinderType: '无给油',
                electrodeType: '握杆',
                imageUrl: 'img/NOC-C1733.png',
                cadUrl: 'downloads/NOC-C1733.cad',
                stepUrl: 'downloads/NOC-C1733.step'
            },
            {
                code: 'NOC-C1736',
                type: 'NOC',
                throatDepth: 543,
                throatWidth: 200,
                pressure: 25,
                workingStroke: 250,
                auxiliaryStroke: 3200,
                hangerType: 'BB',
                cylinderType: '无给油',
                electrodeType: '握杆',
                imageUrl: 'img/NOC-C1736.png',
                cadUrl: 'downloads/NOC-C1736.cad',
                stepUrl: 'downloads/NOC-C1736.step'
            },
            {
                code: 'NOC-C1752',
                type: 'NOC',
                throatDepth: 320,
                throatWidth: 380,
                pressure: 30,
                workingStroke: 150,
                auxiliaryStroke: 3500,
                hangerType: 'BB',
                cylinderType: '无给油',
                electrodeType: '握杆',
                imageUrl: 'img/NOC-C1752.png',
                cadUrl: 'downloads/NOC-C1752.cad',
                stepUrl: 'downloads/NOC-C1752.step'
            },
            {
                code: 'NOX-C1001',
                type: 'NOX',
                throatDepth: 200,
                throatWidth: 300,
                pressure: 20,
                workingStroke: 120,
                auxiliaryStroke: 3000,
                hangerType: '普通(A,G等)',
                cylinderType: '给油',
                electrodeType: 'L型电极臂',
                imageUrl: 'img/NOX-C1001.png',
                cadUrl: 'downloads/NOX-C1001.cad',
                stepUrl: 'downloads/NOX-C1001.step'
            }
        ];
        
        await Gun.bulkCreate(guns);
        console.log('焊枪数据创建完成');
        
        console.log('初始化数据完成');
    } catch (error) {
        console.error('初始化数据错误:', error);
    } finally {
        // 关闭数据库连接
        await sequelize.close();
    }
}

// 执行初始化
initData();
