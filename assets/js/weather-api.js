// Real-time Weather API Integration
class WeatherAPI {
    constructor(apiKey, provider = 'openweather') {
        this.apiKey = apiKey;
        this.provider = provider;
        this.baseUrls = {
            openweather: 'https://api.openweathermap.org/data/2.5',
            nws: 'https://api.weather.gov',
            noaa: 'https://api.weather.gov'
        };
        this.weatherOffices = {
            '47.6062,-122.3321': 'SEW', // Seattle area
            '47.6740,-122.1215': 'SEW', // Seattle area
        };
    }

    // Get current weather data
    async getCurrentWeather(lat, lon) {
        try {
            if (this.provider === 'nws') {
                return await this.getNWSWeather(lat, lon);
            } else {
                const url = `${this.baseUrls.openweather}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! category: ${response.category}`);
                }
                
                const data = await response.json();
                return this.parseWeatherData(data);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return this.getFallbackData();
        }
    }

    // Get National Weather Service data (完全免費)
    async getNWSWeather(lat, lon) {
        try {
            // NWS 不需要 API Key，完全免費
            const pointUrl = `${this.baseUrls.nws}/points/${lat},${lon}`;
            const pointResponse = await fetch(pointUrl);
            
            if (!pointResponse.ok) {
                throw new Error('NWS Point endpoint failed');
            }
            
            const pointData = await pointResponse.json();
            const forecastUrl = pointData.properties.forecast;
            
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
            
            return this.parseNWSData(forecastData, lat, lon);
            
        } catch (error) {
            console.error('NWS API error:', error);
            return this.getFallbackData();
        }
    }

    // Parse NWS-specific data with user report integration
    async parseNWSData(data, lat, lon) {
        const current = data.properties.periods[0];
        const properties = data.properties;
        
        // Get nearby user reports for enhanced risk calculation
        const userReports = await this.getUserReportsForLocation(lat, lon);
        
        return {
            temperature: Math.round((current.temperature - 32) * 5/9), // Convert F to C
            humidity: this.extractHumidityFromText(current.detailedForecast),
            rainfall: this.extractRainfallFromText(current.detailedForecast),
            condition: current.shortForecast,
            windSpeed: this.extractWindSpeed(current.windSpeed),
            pressure: null, // NWS doesn't always provide this
            visibility: 10, // Default value
            floodRisk: this.calculateNWSFloodRisk(current.detailedForecast, userReports),
            userReportInfluence: this.calculateUserReportInfluence(userReports),
            nearbyReports: userReports,
            location: properties.relativeLocation.properties,
            alerts: properties.parameterNames?.includes('WWA') || false,
            lastUpdated: properties.updateTime
        };
    }

    // Extract humidity from NWS detailed forecast text
    extractHumidityFromText(text) {
        const humidityMatch = text.match(/(\d+)%/);
        return humidityMatch ? parseInt(humidityMatch[1]) : 75; // Default
    }

    // Extract rainfall from NWS text
    extractRainfallFromText(text) {
        const rainMatch = text.match(/(\d+(?:\.\d+)?)\s*inch(?:es)?/i);
        if (rainMatch) {
            return parseFloat(rainMatch[1]) * 25.4; // Convert inches to mm
        }
        
        // Look for precipitation probability
        const probMatch = text.match(/(\d+)%/);
        if (probMatch && text.toLowerCase().includes('rain')) {
            return Math.random() * parseFloat(probMatch[1]) / 100 * 5; // Estimate
        }
        
        return 0;
    }

    // Extract wind speed from NWS wind speed text
    extractWindSpeed(windText) {
        const windMatch = windText.match(/(\d+)\s*to\s*(\d+)/) || windText.match(/(\d+)/);
        if (windMatch) {
            return windMatch.length > 2 ? 
                (parseFloat(windMatch[1]) + parseFloat(windMatch[2]))/2 * 0.44704 : // Convert mph to m/s
                parseFloat(windMatch[1]) * 0.44704;
        }
        return 5; // Default 5 m/s
    }

    // Calculate flood risk based on NWS forecast text + user reports
    calculateNWSFloodRisk(detailedForecast, userReports = []) {
        const text = detailedForecast.toLowerCase();
        
        let riskScore = 0;
        
        // Weather-based risk factors
        // Heavy rain keywords
        if (text.includes('heavy rain') || text.includes('torrential')) {
            riskScore += 40;
        } else if (text.includes('moderate rain')) {
            riskScore += 25;
        } else if (text.includes('light rain')) {
            riskScore += 15;
        }
        
        // Flooding keywords
        if (text.includes('flood') || text.includes('flash flood')) {
            riskScore += 50;
        }
        
        // Storm keywords
        if (text.includes('severe storm') || text.includes('thunderstorm')) {
            riskScore += 20;
        }
        
        // Wind keywords
        if (text.includes('strong wind') || text.includes('gale')) {
            riskScore += 15;
        }
        
        // User report integration
        riskScore += this.calculateUserReportInfluence(userReports);
        
        // Determine risk level
        if (riskScore >= 80) return 'Critical';
        if (riskScore >= 60) return 'High';
        if (riskScore >= 35) return 'Medium';
        return 'Low';
    }
    
    // Enhanced flood risk calculation with user reports
    calculateFloodRisk(data, userReports = []) {
        let riskScore = 0;
        
        // Weather data factors
        const rainFall = data.rain?.["1h"] || 0;
        if (rainFall > 15) riskScore += 40;
        else if (rainFall > 10) riskScore += 25;
        else if (rainFall > 5) riskScore += 15;
        
        // High humidity increases risk
        if (data.main.humidity > 90) riskScore += 20;
        else if (data.main.humidity > 80) riskScore += 10;
        
        // Strong winds contribute to flooding risk
        if (data.wind?.speed > 15) riskScore += 15;
        else if (data.wind?.speed > 10) riskScore += 10;
        
        // Low pressure indicates storm conditions
        if (data.main.pressure < 1000) riskScore += 15;
        else if (data.main.pressure < 1010) riskScore += 10;
        
        // Integrate user reports
        riskScore += this.calculateUserReportInfluence(userReports);
        
        // Determine final risk level
        if (riskScore >= 80) return 'Critical';
        if (riskScore >= 60) return 'High';
        if (riskScore >= 35) return 'Medium';
        return 'Low';
    }
    
    // Calculate risk influence from user reports
    calculateUserReportInfluence(userReports) {
        if (!userReports || userReports.length === 0) return 0;
        
        let influenceScore = 0;
        const recentReports = userReports.filter(report => {
            const reportTime = new Date(report.timestamp);
            const now = new Date();
            return (now - reportTime) < 24 * 60 * 60 * 1000; // Last 24 hours
        });
        
        if (recentReports.length === 0) return 0;
        
        // Analyze report patterns
        const dangerReports = recentReports.filter(r => r.status === 'danger');
        const safeReports = recentReports.filter(r => r.status === 'safe');
        const criticalReports = recentReports.filter(r => r.severity === 'critical');
        
        // Danger reports increase risk
        dangerReports.forEach(report => {
            switch(report.severity) {
                case 'critical': influenceScore += 25; break;
                case 'high': influenceScore += 15; break;
                case 'medium': influenceScore += 10; break;
                case 'low': influenceScore += 5; break;
            }
        });
        
        // Safe reports provide risk mitigation
        safeReports.forEach(report => {
            influenceScore -= 3; // Reduce risk slightly
        });
        
        // Critical reports have significant impact
        criticalReports.forEach(report => {
            influenceScore += 30; // Major risk increase
        });
        
        // Normalize influence (cap at 50 points)
        return Math.min(50, Math.max(-10, influenceScore));
    }
    
    // Get nearby user reports for location
    async getUserReportsForLocation(lat, lng, radiusKm = 2) {
        try {
            const storedReports = JSON.parse(localStorage.getItem('userReports') || '[]');
            const mapLocations = JSON.parse(localStorage.getItem('mapLocations') || '[]');
            
            // Merge user reports with map mark data
            const allReports = [
                ...storedReports,
                ...mapLocations.map(loc => ({
                    status: loc.point > 0 ? 'safe' : 'danger',
                    severity: this.getSeverityFromPoint(loc.point),
                    timestamp: loc.timestamp || new Date().toISOString(),
                    lat: loc.lat,
                    lng: loc.lng,
                    description: loc.description || 'User marked location',
                    source: 'map-mark'
                }))
            ];
            
            // Filter by distance
            return allReports.filter(report => {
                if (!report.lat || !report.lng) return false;
                const distance = this.calculateDistance(lat, lng, report.lat, report.lng);
                return distance <= radiusKm;
            });
            
        } catch (error) {
            console.error('Error loading user reports:', error);
            return [];
        }
    }
    
    // Calculate distance between two coordinates
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    // Get severity based on user point system
    getSeverityFromPoint(point) {
        const absPoint = Math.abs(point);
        if (absPoint >= 8) return 'critical';
        if (absPoint >= 5) return 'high';
        if (absPoint >= 3) return 'medium';
        return 'low';
    }

    // Get flood risk forecast
    async getFloodForecast(lat, lon) {
        try {
            const url = `${this.baseUrls.openweather}/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}&exclude=current,minutely&units=metric`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! category: ${response.category}`);
            }
            
            const data = await response.json();
            return this.parseForecastData(data);
        } catch (error) {
            console.error('Error fetching forecast data:', error);
            return this.getFallbackForecast();
        }
    }

    // Parse weather data to our format
    parseWeatherData(data) {
        return {
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            rainfall: this.calculateRainfall(data),
            condition: data.weather[0].description,
            windSpeed: data.wind?.speed || 0,
            pressure: data.main.pressure,
            visibility: data.visibility / 1000, // convert to km
            floodRisk: this.calculateFloodRisk(data),
            lastUpdated: new Date().toISOString()
        };
    }

    // Calculate flood risk based on multiple factors
    calculateFloodRisk(data) {
        let riskScore = 0;
        
        // Rainfall factor (most important)
        const rainFall = this.calculateRainfall(data);
        if (rainFall > 10) riskScore += 40;
        else if (rainFall > 5) riskScore += 25;
        else if (rainFall > 2) riskScore += 15;
        
        // Humidity factor
        if (data.main.humidity > 90) riskScore += 20;
        else if (data.main.humidity > 80) riskScore += 10;
        
        // Wind factor
        if (data.wind?.speed > 15) riskScore += 15;
        else if (data.wind?.speed > 10) riskScore += 10;
        
        // Pressure factor (low pressure indicates storm)
        if (data.main.pressure < 1000) riskScore += 15;
        else if (data.main.pressure < 1010) riskScore += 10;
        
        // Determine risk level
        if (riskScore >= 60) return 'Critical';
        if (riskScore >= 40) return 'High';
        if (riskScore >= 20) return 'Medium';
        return 'Low';
    }

    // Calculate current rainfall from weather data
    calculateRainfall(data) {
        // Check if there's precipitation data
        if (data.rain && data.rain['1h']) {
            return data.rain['1h'];
        }
        if (data.rain && data.rain['3h']) {
            return data.rain['3h'] / 3; // hourly average
        }
        
        // Estimate based on humidity and cloud conditions
        const cloudCover = data.clouds?.all || 0;
        const humidity = data.main?.humidity || 0;
        
        if (humidity > 95 && cloudCover > 90) return Math.random() * 5 + 2; // 2-7mm
        if (humidity > 85 && cloudCover > 70) return Math.random() * 2 + 0.5; // 0.5-2.5mm
        return 0;
    }

    // Parse forecast data
    parseForecastData(data) {
        return {
            hourly: data.hourly.slice(0, 24).map(hour => ({
                time: new Date(hour.dt * 1000),
                temperature: Math.round(hour.temp),
                rainfall: this.calculateRainfall(hour),
                humidity: hour.humidity,
                condition: hour.weather[0].description,
                floodRisk: this.calculateFloodRisk(hour)
            })),
            daily: data.daily.slice(0, 7).map(day => ({
                date: new Date(day.dt * 1000),
                high: Math.round(day.temp.max),
                low: Math.round(day.temp.min),
                rainfall: this.calculateRainfall(day),
                condition: day.weather[0].description,
                floodRisk: this.calculateFloodRisk(day)
            }))
        };
    }

    // Fallback data for API failures
    getFallbackData() {
        return {
            temperature: 18,
            humidity: 75,
            rainfall: Math.random() * 3,
            condition: 'Unknown',
            windSpeed: 5,
            pressure: 1013,
            visibility: 10,
            floodRisk: 'Low',
            lastUpdated: new Date().toISOString()
        };
    }

    getFallbackForecast() {
        return {
            hourly: [],
            daily: []
        };
    }

    // Update local weather data
    async updateWeatherData(lat, lon) {
        const currentWeather = await this.getCurrentWeather(lat, lon);
        const forecast = await this.getFloodForecast(lat, lon);
        
        // Update localStorage
        const weatherData = {
            current: currentWeather,
            forecast: forecast,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('realtimeWeather', JSON.stringify(weatherData));
        return weatherData;
    }

    // Subscribe to location changes
    init(locationCallback) {
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const weatherData = await this.updateWeatherData(latitude, longitude);
                    if (locationCallback) locationCallback(weatherData);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        }
    }
}

// Export for use in other files
window.WeatherAPI = WeatherAPI;
