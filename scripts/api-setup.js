// OpenWeatherMap API 設置腳本
// 這個腳本會自動在您的專案中設置 API 配置

console.log('🌊 Splash - OpenWeatherMap API 設置工具');
console.log('=====================================');

// API 設置指南
function showSetupInstructions() {
    console.log('\n📝 API 設置步驟:');
    console.log('1. 訪問: https://openweathermap.org/api');
    console.log('2. 點擊 "Sign Up" 註冊免費帳戶');
    console.log('3. 驗證信箱後登入');
    console.log('4. 前往 "My API Keys" 頁面');
    console.log('5. 複製您的免費 API Key');
    console.log('6. 在 map.html 中替換 YOUR_API_KEY');
    console.log('\n🎯 免費額度: 1000 次/天 (~月免費)');
    console.log('📊 預估用量: ~20 次/天 (完全免費)');
    console.log('\n🔧 設置完成後測試步驟:');
    console.log('1. 打開 map.html 頁面');
    console.log('2. 按 F12 打開開發者工具');
    console.log('3. 查看 Console 是否顯示 "Weather data updated"');
    console.log('4. 檢查天氣資料是否自動更新');
}

// 顯示當前的 API 配置狀態
function checkCurrentConfig() {
    const fs = require('fs');
    const path = require('path');
    
    try {
        const mapHtmlPath = path.join(__dirname, '..', 'map.html');
        const content = fs.readFileSync(mapHtmlPath, 'utf8');
        
        if (content.includes('YOUR_API_KEY')) {
            console.log('\n❌ 狀態: API Key 尚未設置');
            console.log('   需要替換 map.html 中的 YOUR_API_KEY');
        } else if (content.includes('const weatherAPI = new WeatherAPI(')) {
            console.log('\n✅ 狀態: API 配置已準備就緒');
            console.log('   請確認 key 是有效的 OpenWeatherMap API Key');
        } else {
            console.log('\n⚠️ 狀態: 未檢測到 API 配置');
            console.log('   請檢查 map.html 中的設置');
        }
    } catch (error) {
        console.log('\n❌ 無法檢查當前配置:', error.message);
    }
}

// 驗證 API Key 格式
function validateAPIKey(key) {
    if (!key || key === 'YOUR_API_KEY') {
        return false;
    }
    
    // OpenWeatherMap API Key 通常是 32 字符長
    if (key.length >= 20 && key.match(/^[a-zA-Z0-9]+$/)) {
        return true;
    }
    
    return false;
}

// 自動化設置功能
function setupAPIKey(apiKey) {
    if (!validateAPIKey(apiKey)) {
        console.log('❌ API Key 格式無效');
        return false;
    }
    
    const fs = require('fs');
    const path = require('path');
    
    try {
        const mapHtmlPath = path.join(__dirname, '..', 'map.html');
        let content = fs.readFileSync(mapHtmlPath, 'utf8');
        
        // 替換 API Key
        content = content.replace("'YOUR_API_KEY'", `'${apiKey}'`);
        
        fs.writeFileSync(mapHtmlPath, content);
        console.log('✅ API Key 已成功設置！');
        console.log('🌊 現在可以測試即時天氣功能了');
        return true;
        
    } catch (error) {
        console.log('❌ 設置失敗:', error.message);
        return false;
    }
}

// 測試 API 連接
async function testAPIConnection() {
    console.log('\n🧪 測試 API 連接...');
    
    try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=47.6062&lon=-122.3321&appid=demo&units=metric');

        if (response.status === 401) {
            console.log('✅ API 服務正常，但是 API Key 無效');
            console.log('   請檢查您的 API Key 是否正確');
        } else if (response.status === 404) {
            console.log('❌ API 端點無效');
        } else if (response.ok) {
            console.log('✅ API 連接正常！');
        } else {
            console.log(`⚠️ API 回應異常: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 無法連接到 API:', error.message);
        console.log('   請檢查網路連接');
    }
}

// 主程式
function main() {
    showSetupInstructions();
    checkCurrentConfig();
    
    console.log('\n🚀 設置完成後，您的 Splash 平台將具備:');
    console.log('   • 🌡️ 即時溫度監測');
    console.log('   • 🌧️ 準確降雨量');
    console.log('   • ⚠️ 智能洪水風險評估');
    console.log('   • 📍 位置感知天氣');
    console.log('   • 🔄 自動資料更新');
}

// 如果是在 Node.js 環境中執行
if (typeof require !== 'undefined') {
    main();
}

// 導出函數供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupAPIKey,
        validateAPIKey,
        testAPIConnection
    };
}
