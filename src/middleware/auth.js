// 权限管理中间件

// 检查用户是否登录
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: '请先登录' });
    }
}

// 检查用户是否为管理员
function isAdmin(req, res, next) {
    if (req.session.userId && req.session.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: '权限不足，需要管理员权限' });
    }
}

// 检查用户是否为管理员或资源所有者
function isAdminOrOwner(req, res, next) {
    if (req.session.userId && (req.session.role === 'admin' || req.session.userId === parseInt(req.params.id))) {
        next();
    } else {
        res.status(403).json({ message: '权限不足' });
    }
}

module.exports = {
    isAuthenticated,
    isAdmin,
    isAdminOrOwner
};