// 性能优化中间件

// 缓存控制中间件
function cacheControl(req, res, next) {
    // 设置静态文件缓存时间为1天
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    next();
}

// 请求处理时间中间件
function requestTime(req, res, next) {
    const start = Date.now();
    
    // 在响应结束时计算处理时间
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${duration}ms`);
    });
    
    next();
}

// 压缩中间件（如果需要）
function compression() {
    return (req, res, next) => {
        // 检查客户端是否支持压缩
        const acceptEncoding = req.headers['accept-encoding'] || '';
        
        if (acceptEncoding.includes('gzip')) {
            res.setHeader('Content-Encoding', 'gzip');
            // 这里可以添加实际的压缩逻辑
        }
        
        next();
    };
}

module.exports = {
    cacheControl,
    requestTime,
    compression
};