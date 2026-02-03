// 内存存储模拟数据库
class MockDatabase {
    constructor() {
        this.users = [];
        this.guns = [];
        this.searchHistories = [];
        this.favorites = [];
        this.userIdCounter = 1;
        this.gunIdCounter = 1;
        this.historyIdCounter = 1;
        this.favoriteIdCounter = 1;
    }
    
    // 获取所有用户
    getUsers() {
        return this.users;
    }
    
    // 根据用户名查找用户
    findUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }
    
    // 创建用户
    createUser(userData) {
        const user = {
            id: this.userIdCounter++,
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.users.push(user);
        return user;
    }
    
    // 获取所有焊枪
    getGuns() {
        return this.guns;
    }
    
    // 根据类型获取焊枪
    getGunsByType(type) {
        return this.guns.filter(gun => gun.type === type);
    }
    
    // 根据ID获取焊枪
    getGunById(id) {
        return this.guns.find(gun => gun.id === id);
    }
    
    // 创建焊枪
    createGun(gunData) {
        const gun = {
            id: this.gunIdCounter++,
            ...gunData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.guns.push(gun);
        return gun;
    }
    
    // 搜索焊枪
    searchGuns(params) {
        return this.guns.filter(gun => {
            let match = true;
            
            if (params.type && gun.type !== params.type) {
                match = false;
            }
            
            if (params.throatDepthMin && gun.throatDepth < params.throatDepthMin) {
                match = false;
            }
            
            if (params.throatDepthMax && gun.throatDepth > params.throatDepthMax) {
                match = false;
            }
            
            if (params.throatWidthMin && gun.throatWidth < params.throatWidthMin) {
                match = false;
            }
            
            if (params.throatWidthMax && gun.throatWidth > params.throatWidthMax) {
                match = false;
            }
            
            if (params.pressureMin && gun.pressure < params.pressureMin) {
                match = false;
            }
            
            if (params.pressureMax && gun.pressure > params.pressureMax) {
                match = false;
            }
            
            if (params.workingStrokeMin && gun.workingStroke < params.workingStrokeMin) {
                match = false;
            }
            
            if (params.workingStrokeMax && gun.workingStroke > params.workingStrokeMax) {
                match = false;
            }
            
            if (params.auxiliaryStrokeMin && gun.auxiliaryStroke < params.auxiliaryStrokeMin) {
                match = false;
            }
            
            if (params.auxiliaryStrokeMax && gun.auxiliaryStroke > params.auxiliaryStrokeMax) {
                match = false;
            }
            
            if (params.hangerType && gun.hangerType !== params.hangerType) {
                match = false;
            }
            
            if (params.cylinderType && gun.cylinderType !== params.cylinderType) {
                match = false;
            }
            
            if (params.electrodeType && gun.electrodeType !== params.electrodeType) {
                match = false;
            }
            
            return match;
        });
    }
    
    // 保存搜索历史
    createSearchHistory(historyData) {
        const history = {
            id: this.historyIdCounter++,
            ...historyData,
            createdAt: new Date()
        };
        this.searchHistories.push(history);
        return history;
    }
    
    // 获取用户搜索历史
    getUserSearchHistories(userId) {
        return this.searchHistories
            .filter(history => history.userId === userId)
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 10);
    }
    
    // 添加收藏
    addFavorite(favoriteData) {
        // 检查是否已经收藏
        const existingFavorite = this.favorites.find(
            fav => fav.userId === favoriteData.userId && fav.gunId === favoriteData.gunId
        );
        
        if (existingFavorite) {
            return existingFavorite;
        }
        
        const favorite = {
            id: this.favoriteIdCounter++,
            ...favoriteData,
            createdAt: new Date()
        };
        this.favorites.push(favorite);
        return favorite;
    }
    
    // 移除收藏
    removeFavorite(userId, gunId) {
        const index = this.favorites.findIndex(
            fav => fav.userId === userId && fav.gunId === gunId
        );
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            return true;
        }
        
        return false;
    }
    
    // 获取用户的收藏列表
    getUserFavorites(userId) {
        const favoriteGuns = this.favorites
            .filter(fav => fav.userId === userId)
            .map(fav => this.getGunById(fav.gunId))
            .filter(gun => gun !== undefined);
        
        return favoriteGuns;
    }
    
    // 检查是否已收藏
    isFavorite(userId, gunId) {
        return this.favorites.some(
            fav => fav.userId === userId && fav.gunId === gunId
        );
    }
    
    // 初始化数据
    initData() {
        // 初始化用户
        this.users = [
            {
                id: 1,
                username: 'admin',
                password: '$2a$10$gVtLC5uPxrynn3flEY3JoeTvFh8EwolQp8yycU0uWFHRQDyw3yVI.', // admin123
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                username: 'user',
                password: '$2a$10$gVtLC5uPxrynn3flEY3JoeTvFh8EwolQp8yycU0uWFHRQDyw3yVI.', // user123
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        this.userIdCounter = 3;
        
        // 初始化焊枪
        this.guns = [
            {
                id: 1,
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
                stepUrl: 'downloads/NOC-C1658.step',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
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
                stepUrl: 'downloads/NOC-C1732.step',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
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
                stepUrl: 'downloads/NOC-C1733.step',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 4,
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
                stepUrl: 'downloads/NOC-C1736.step',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 5,
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
                stepUrl: 'downloads/NOC-C1752.step',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 6,
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
                stepUrl: 'downloads/NOX-C1001.step',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        this.gunIdCounter = 7;
        
        // 初始化搜索历史
        this.searchHistories = [];
        this.historyIdCounter = 1;
    }
}

// 创建数据库实例
const mockDb = new MockDatabase();

// 初始化数据
mockDb.initData();

module.exports = {
    mockDb
};
