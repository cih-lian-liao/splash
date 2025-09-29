# 🌊 Splash - Real-time Map API Setup Guide

## 🎯 **Current Setup: National Weather Service (NWS)**

### ✅ **Configuration Complete**
Using **National Weather Service API** - **100% Free**!

Current setup in `map.html`:
```javascript
const weatherAPI = new WeatherAPI('NO_API_KEY_NEEDED', 'nws');
```

### 🆓 **NWS Advantages**
- ✅ **Completely Free**: Government service, never charges
- ✅ **No Rate Limits**: Use as much as you want
- ✅ **No Registration Required**: No API Key needed
- ✅ **Professional Flood Data**: Official US weather service
- ✅ **High Accuracy**: Optimized for US regions

### ⚠️ **Regional Limitations**
- 🗺️ **Coverage**: US mainland, Hawaii, Alaska
- 🌍 **Restriction**: Not available outside US territories

### 🧪 **Testing NWS Connection**
```
1. Open map.html page
2. Allow browser location access (or use Seattle default)
3. Check Console for NWS data loading messages
4. Observe weather data auto-updating
```

### 📍 **Test Data Examples**
- **Region**: Seattle (47.6062, -122.3321)
- **Weather Office**: SEW (Seattle Weather Office)
- **Data Source**: US National Weather Service

## 🔧 **API Features Overview**

### ✅ **Implemented Features**
- **Real-time Weather Data**: Temperature, humidity, rainfall, conditions
- **Flood Risk Assessment**: Automatic calculation based on weather patterns
- **Location-based Updates**: Auto-refresh with map movement
- **Fallback System**: Static data backup if API unavailable
- **Data Caching**: 10-minute cache for performance optimization

### 🌡️ **Weather Data Included**
- **Temperature**: Real-time in Celsius
- **Humidity**: Percentage levels
- **Rainfall**: Precipitation in mm
- **Wind Speed**: Current conditions in m/s
- **Flood Risk**: Low/Medium/High/Critical levels
- **Location Info**: City and state details

### 🔄 **Automatic Updates**
- **Map Movement**: Updates when user changes location
- **Cache Strategy**: Uses localStorage for offline capability
- **Error Handling**: Graceful fallback to static data
- **Real-time Alerts**: Toast notifications for high-risk conditions

## 🚀 **How It Works**

### 1. **Location Detection**
- Browser geolocation API gets user position
- Defaults to Seattle coordinates if denied
- Updates automatically when map is moved

### 2. **API Data Fetching**
- Calls NWS API with latitude/longitude
- Parses government weather station data
- Extracts meaningful weather information

### 3. **Risk Calculation**
- Analyzes detailed forecast text for flood keywords
- Scores risk based on rain intensity and conditions
- Returns Low/Medium/High/Critical risk levels

### 4. **UI Updates**
- Temperature, rainfall, humidity display
- Color-coded flood risk indicators
- Dynamic alert notifications
- Real-time data refresh

## 📱 **Mobile Compatibility**

### **Responsive Design**
- ✅ **Mobile-First**: Designed for smartphone screens
- ✅ **Touch-Friendly**: Easy navigation on touch devices
- ✅ **Fast Loading**: Optimized for mobile networks
- ✅ **Offline Support**: Works with cached data when offline

### **Performance Optimizations**
- **Lazy Loading**: Only loads data when needed
- **Cache Strategy**: Reduces API calls
- **Compression**: Minimized file sizes
- **CDN Ready**: Compatible with content delivery networks

## 🔧 **Advanced Configuration**

### **API Provider Options**
```javascript
// Option 1: National Weather Service (Current - Free)
const weatherAPI = new WeatherAPI('NO_API_KEY_NEEDED', 'nws');

// Option 2: OpenWeatherMap (Requires API Key)
const weatherAPI = new WeatherAPI('your-openweather-api-key', 'openweather');

// Option 3: Google Maps Platform Climate API (Paid)
const weatherAPI = new WeatherAPI('your-google-api-key', 'google');
```

### **Custom Settings**
```javascript
// Modify weather office mappings
weatherAPI.weatherOffices = {
    '47.6062,-122.3321': 'SEW', // Seattle area
    '40.7128,-74.0060': 'OKX', // New York area
    // Add more locations as needed
};

// Adjust cache duration (milliseconds)
const CACHE_DURATION = 600000; // 10 minutes
localStorage.setItem('realtimeWeatherCache', JSON.stringify({
    ...weatherData,
    timestamp: Date.now()
}));
```

## 🚨 **Troubleshooting**

### **Common Issues & Solutions**

| Issue | Cause | Solution |
|-------|-------|----------|
| No weather data | API connection failed | Check internet connection |
| Wrong location | Geolocation denied | Allow location access in browser |
| Outdated data | Cache too old | Refresh page or move map |
| Flood alerts | Risk calculation errors | Verify coordinates are in US |

### **Debug Mode**
Enable debug logging in browser console:
```javascript
// In browser console
localStorage.setItem('debugWeather', 'true');
```

## 📞 **Support**

### **Documentation Links**
- [National Weather Service API](https://www.weather.gov/documentation/services-web-api)
- [NWS API Documentation](https://api.weather.gov/)
- [Splash Project Repository](#) (if applicable)

### **Contact Information**
- **Technical Issues**: Check browser console for error messages
- **Feature Requests**: Document desired enhancements
- **Bug Reports**: Include browser version and error logs

## 🎉 **Success Indicators**

When everything is working correctly, you should see:
- ✅ Weather data displays in top-left corner of map
- ✅ Temperature updates based on selected location
- ✅ Flood risk shows color-coded status (green/yellow/red)
- ✅ Toast notifications for high-risk conditions
- ✅ Console shows "Weather data updated" messages
- ✅ Automatic updates when moving map cursor

---

**🎯 Ready to Go!** Your flood management dashboard is now connected to real-time National Weather Service data!