const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { mockDb } = require('../config/database');

// 下载图片
router.get('/image/:id', (req, res) => {
    try {
        const { id } = req.params;
        const gun = mockDb.getGunById(parseInt(id));
        
        if (!gun || !gun.imageUrl) {
            return res.status(404).json({ message: '图片不存在' });
        }
        
        const imagePath = path.join(__dirname, '..', 'public', gun.imageUrl);
        
        // 检查文件是否存在
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: '图片文件不存在' });
        }
        
        // 下载文件
        res.download(imagePath, `${gun.code}.png`);
    } catch (error) {
        console.error('下载图片错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 下载CAD文件
router.get('/cad/:id', (req, res) => {
    try {
        const { id } = req.params;
        const gun = mockDb.getGunById(parseInt(id));
        
        if (!gun || !gun.cadUrl) {
            return res.status(404).json({ message: 'CAD文件不存在' });
        }
        
        const cadPath = path.join(__dirname, '..', gun.cadUrl);
        
        // 检查文件是否存在
        if (!fs.existsSync(cadPath)) {
            return res.status(404).json({ message: 'CAD文件不存在' });
        }
        
        // 下载文件
        res.download(cadPath, `${gun.code}.cad`);
    } catch (error) {
        console.error('下载CAD错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 下载STEP文件
router.get('/step/:id', (req, res) => {
    try {
        const { id } = req.params;
        const gun = mockDb.getGunById(parseInt(id));
        
        if (!gun || !gun.stepUrl) {
            return res.status(404).json({ message: 'STEP文件不存在' });
        }
        
        const stepPath = path.join(__dirname, '..', gun.stepUrl);
        
        // 检查文件是否存在
        if (!fs.existsSync(stepPath)) {
            return res.status(404).json({ message: 'STEP文件不存在' });
        }
        
        // 下载文件
        res.download(stepPath, `${gun.code}.step`);
    } catch (error) {
        console.error('下载STEP错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

module.exports = router;
