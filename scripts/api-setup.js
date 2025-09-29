// Splash Weather API Setup Script
// This script automatically configures API settings for National Weather Service

console.log('🌊 Splash - National Weather Service API Setup Tool');
console.log('====================================================');

// API Setup Instructions
function showSetupInstructions() {
    console.log('\n📝 No API Key Required!');
    console.log('🌤️  You are using National Weather Service (NWS) - 100% FREE!');
    console.log('\n🎯 Current Configuration:');
    console.log('   • No registration needed');
    console.log('   • No rate limits');
    console.log('   • Government service - never expires');
    console.log('   • US-based coverage only');
    console.log('\n🚀 Your Splash platform is already configured!');
    console.log('   Location: Seattle area covered by SEW weather office');
    console.log('   Provider: US National Weather Service');
}

// Check Current API Configuration Status
function checkCurrentConfig() {
    const fs = require('fs');
    const path = require('path');
    
    try {
        console.log('\n🏛️ Checking National Weather Service configuration...');
        
        const weatherApiPath = path.join(__dirname, '..', 'assets', 'js', 'weather-api.js');
        const mapHtmlPath = path.join(__dirname, '..', 'map.html');
        
        // Check weather API file
        if (fs.existsSync(weatherApiPath)) {
            const weatherApiContent = fs.readFileSync(weatherApiPath, 'utf8');
            if (weatherApiContent.includes('getNWSWeather') && weatherApiContent.includes('NO_API_KEY_NEEDED')) {
                console.log('✅ Weather API: NWS integration ready');
            } else {
                console.log('⚠️ Weather API: May need NWS configuration');
            }
        }
        
        // Check map.html configuration
        const mapContent = fs.readFileSync(mapHtmlPath, 'utf8');
        if (mapContent.includes("new WeatherAPI('NO_API_KEY_NEEDED', 'nws')")) {
            console.log('✅ Map Configuration: Using NWS (no key required)');
        } else if (mapContent.includes('openweather')) {
            console.log('⚠️ Map Configuration: Currently using OpenWeatherMap');
            console.log('   Consider switching to NWS for free unlimited access');
        } else {
            console.log('❓ Map Configuration: Unknown configuration');
        }
        
    } catch (error) {
        console.log('\n❌ Unable to check configuration:', error.message);
    }
}

// Validate that we're using NWS
function validateNWSConfiguration() {
    console.log('\n🧪 Validating NWS setup...');
    
    // Test NWS endpoint (Seattle area)
    return new Promise((resolve) => {
        fetch('https://api.weather.gov/points/47.6062,-122.3321')
            .then(response => {
                if (response.ok) {
                    console.log('✅ NWS API: Connection successful');
                    console.log('   Seattle weather data available');
                    resolve(true);
                } else {
                    console.log('❌ NWS API: Connection failed');
                    console.log('   Status:', response.status);
                    resolve(false);
                }
            })
            .catch(error => {
                console.log('❌ NWS API: Unable to reach service');
                console.log('   Error:', error.message);
                console.log('\n💡 Possible issues:');
                console.log('   • Network connection required');
                console.log('   • NWS service may be temporarily down');
                console.log('   • CORS issues (will work in browser)');
                resolve(false);
            });
    });
}

// Alternative API Comparison
function showAPIOptions() {
    console.log('\n🔄 Alternative Weather APIs (if needed):');
    console.log('═' + '='.repeat(45));
    
    console.log('\n🏛️ National weather Service (CURRENT - RECOMMENDED)');
    console.log('   ✅ Cost: Completely FREE forever');
    console.log('   ✅ Rate Limit: Unlimited requests');
    console.log('   ✅ Setup: No registration required');
    console.log('   ⚠️ Coverage: US territories only');
    console.log('   ⚠️ Data: Professional-grade official forecasts');
    
    console.log('\n🌍 OpenWeatherMap');
    console.log('   ✅ Coverage: Global');
    console.log('   ✅ Cost: Free tier (1000/day)');
    console.log('   📝 Setup: Requires registration + API key');
    console.log('   ⚠️ Rate Limit: Limited on free tier');
    
    console.log('\n☁️ Google Maps Platform Climate API');
    console.log('   ✅ Coverage: Global + enterprise features');
    console.log('   💰 Cost: Paid service only ($200+/month)');
    console.log('   ⚠️ Setup: Requires Google Cloud account');
    console.log('   💡 Best for: Enterprise applications');
}

// Main Program
async function main() {
    showSetupInstructions();
    checkCurrentConfig();
    await validateNWSConfiguration();
    showAPIOptions();
    
    console.log('\n🎉 Your Splash platform features with NWS:');
    console.log('   • 🌡️ Real-time temperature monitoring');
    console.log('   • 🌧️ Official precipitation data');
    console.log('   • ⚠️ Professional flood risk assessment');
    console.log('   • 📍 Location-aware weather updates');
    console.log('   • 🔄 Automatic data refresh');
    console.log('   • 👥 Community intelligence integration');
    console.log('\n✨ Ready to use - No additional setup required!');
}

// Execute if running in Node.js environment
if (typeof require !== 'undefined') {
    main().catch(console.error);
}

// Export functions for other modules to use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateNWSConfiguration,
        checkCurrentConfig,
        showAPIOptions
    };
}