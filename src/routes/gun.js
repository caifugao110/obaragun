const express = require('express');
const router = express.Router();
const { mockDb } = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// 搜索焊枪
router.post('/search', (req, res) => {
    try {
        const { 
            throatDepthMin, throatDepthMax, 
            throatWidthMin, throatWidthMax, 
            pressureMin, pressureMax, 
            workingStrokeMin, workingStrokeMax, 
            auxiliaryStrokeMin, auxiliaryStrokeMax, 
            hangerType, 
            cylinderType, 
            electrodeType,
            type
        } = req.body;
        
        // 构建查询参数
        const params = {
            type,
            throatDepthMin,
            throatDepthMax,
            throatWidthMin,
            throatWidthMax,
            pressureMin,
            pressureMax,
            workingStrokeMin,
            workingStrokeMax,
            auxiliaryStrokeMin,
            auxiliaryStrokeMax,
            hangerType,
            cylinderType,
            electrodeType
        };
        
        // 执行查询
        const guns = mockDb.searchGuns(params);
        
        // 保存搜索历史
        if (req.session.userId) {
            mockDb.createSearchHistory({
                userId: req.session.userId,
                searchParams: JSON.stringify(req.body),
                searchType: type || 'all',
                resultCount: guns.length
            });
        }
        
        res.status(200).json({ 
            message: '搜索成功',
            count: guns.length,
            guns
        });
    } catch (error) {
        console.error('搜索错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 获取焊枪详情
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const gun = mockDb.getGunById(parseInt(id));
        
        if (!gun) {
            return res.status(404).json({ message: '焊枪不存在' });
        }
        
        res.status(200).json({ 
            message: '获取成功',
            gun
        });
    } catch (error) {
        console.error('获取详情错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 获取焊枪类型列表
router.get('/types/list', (req, res) => {
    try {
        const guns = mockDb.getGuns();
        const types = [...new Set(guns.map(gun => gun.type))];
        
        res.status(200).json({ 
            message: '获取成功',
            types
        });
    } catch (error) {
        console.error('获取类型错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 获取搜索历史
router.get('/history', isAuthenticated, (req, res) => {
    try {
        const history = mockDb.getUserSearchHistories(req.session.userId);
        
        res.status(200).json({ 
            message: '获取成功',
            history
        });
    } catch (error) {
        console.error('获取历史错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 添加收藏
router.post('/favorite', isAuthenticated, (req, res) => {
    try {
        const { gunId } = req.body;
        
        if (!gunId) {
            return res.status(400).json({ message: '缺少焊枪ID' });
        }
        
        // 检查焊枪是否存在
        const gun = mockDb.getGunById(parseInt(gunId));
        if (!gun) {
            return res.status(404).json({ message: '焊枪不存在' });
        }
        
        // 添加收藏
        const favorite = mockDb.addFavorite({
            userId: req.session.userId,
            gunId: parseInt(gunId)
        });
        
        res.status(201).json({ 
            message: '收藏成功',
            favorite
        });
    } catch (error) {
        console.error('添加收藏错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 移除收藏
router.delete('/favorite/:gunId', isAuthenticated, (req, res) => {
    try {
        const { gunId } = req.params;
        
        // 移除收藏
        const result = mockDb.removeFavorite(req.session.userId, parseInt(gunId));
        
        if (result) {
            res.status(200).json({ message: '取消收藏成功' });
        } else {
            res.status(404).json({ message: '收藏不存在' });
        }
    } catch (error) {
        console.error('移除收藏错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 获取收藏列表
router.get('/favorites', isAuthenticated, (req, res) => {
    try {
        const favorites = mockDb.getUserFavorites(req.session.userId);
        
        res.status(200).json({ 
            message: '获取成功',
            favorites
        });
    } catch (error) {
        console.error('获取收藏列表错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 检查是否已收藏
router.get('/favorite/:gunId', isAuthenticated, (req, res) => {
    try {
        const { gunId } = req.params;
        
        const isFavorited = mockDb.isFavorite(req.session.userId, parseInt(gunId));
        
        res.status(200).json({ 
            message: '获取成功',
            isFavorited
        });
    } catch (error) {
        console.error('检查收藏状态错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 产品对比
router.post('/compare', (req, res) => {
    try {
        const { gunIds } = req.body;
        
        if (!gunIds || !Array.isArray(gunIds) || gunIds.length === 0) {
            return res.status(400).json({ message: '缺少焊枪ID列表' });
        }
        
        // 限制对比数量
        if (gunIds.length > 4) {
            return res.status(400).json({ message: '最多只能对比4个产品' });
        }
        
        // 获取焊枪详情
        const guns = gunIds
            .map(id => mockDb.getGunById(parseInt(id)))
            .filter(gun => gun !== undefined);
        
        if (guns.length === 0) {
            return res.status(404).json({ message: '没有找到有效的焊枪' });
        }
        
        res.status(200).json({ 
            message: '对比成功',
            guns
        });
    } catch (error) {
        console.error('产品对比错误:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

module.exports = router;
