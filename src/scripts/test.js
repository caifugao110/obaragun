// 系统功能测试脚本
const http = require('http');
const querystring = require('querystring');

// 测试配置
const baseUrl = 'http://localhost:3000';

// 测试工具函数
function makeRequest(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, data: data });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// 测试案例
async function runTests() {
    console.log('开始测试系统功能...');
    
    try {
        // 测试1: 检查服务器是否运行
        console.log('\n1. 测试服务器状态...');
        const serverStatus = await makeRequest('GET', '/api/auth/status');
        console.log(`服务器状态: ${serverStatus.statusCode}`);
        
        // 测试2: 用户登录
        console.log('\n2. 测试用户登录...');
        const loginData = {
            username: 'admin',
            password: 'admin123'
        };
        const loginResponse = await makeRequest('POST', '/api/auth/login', loginData);
        console.log(`登录状态: ${loginResponse.statusCode}`);
        
        if (loginResponse.statusCode === 200) {
            const loginResult = JSON.parse(loginResponse.data);
            console.log(`登录成功，用户: ${loginResult.user.username}`);
            
            // 提取会话cookie
            const cookies = loginResponse.headers?.['set-cookie'] || [];
            const sessionCookie = cookies.map(cookie => cookie.split(';')[0]).join('; ');
            
            // 测试3: 获取焊枪类型列表
            console.log('\n3. 测试获取焊枪类型列表...');
            const typesResponse = await makeRequest('GET', '/api/gun/types/list', null, {
                'Cookie': sessionCookie
            });
            console.log(`获取类型列表状态: ${typesResponse.statusCode}`);
            if (typesResponse.statusCode === 200) {
                const typesResult = JSON.parse(typesResponse.data);
                console.log(`焊枪类型: ${typesResult.types.join(', ')}`);
            }
            
            // 测试4: 搜索焊枪
            console.log('\n4. 测试搜索焊枪...');
            const searchData = {
                type: 'NOC',
                throatDepthMin: 100,
                throatDepthMax: 400
            };
            const searchResponse = await makeRequest('POST', '/api/gun/search', searchData, {
                'Cookie': sessionCookie
            });
            console.log(`搜索状态: ${searchResponse.statusCode}`);
            if (searchResponse.statusCode === 200) {
                const searchResult = JSON.parse(searchResponse.data);
                console.log(`搜索结果数量: ${searchResult.count}`);
            }
            
            // 测试5: 获取搜索历史
            console.log('\n5. 测试获取搜索历史...');
            const historyResponse = await makeRequest('GET', '/api/gun/history', null, {
                'Cookie': sessionCookie
            });
            console.log(`获取历史状态: ${historyResponse.statusCode}`);
            
            // 测试6: 测试文件下载
            console.log('\n6. 测试文件下载...');
            const downloadResponse = await makeRequest('GET', '/api/download/cad/1', null, {
                'Cookie': sessionCookie
            });
            console.log(`下载CAD文件状态: ${downloadResponse.statusCode}`);
            
            // 测试7: 用户退出登录
            console.log('\n7. 测试用户退出登录...');
            const logoutResponse = await makeRequest('POST', '/api/auth/logout', null, {
                'Cookie': sessionCookie
            });
            console.log(`退出登录状态: ${logoutResponse.statusCode}`);
        }
        
        // 测试8: 测试产品对比功能
        console.log('\n8. 测试产品对比功能...');
        const compareData = {
            gunIds: [1, 2, 3]
        };
        const compareResponse = await makeRequest('POST', '/api/gun/compare', compareData);
        console.log(`产品对比状态: ${compareResponse.statusCode}`);
        if (compareResponse.statusCode === 200) {
            const compareResult = JSON.parse(compareResponse.data);
            console.log(`对比产品数量: ${compareResult.guns.length}`);
        }
        
        console.log('\n测试完成！');
        
    } catch (error) {
        console.error('测试过程中出现错误:', error);
    }
}

// 运行测试
runTests();
