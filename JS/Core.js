// Core Configuration and Utilities Module
(function() {
    'use strict';

    console.log('[USDA Core] Loading core module');

    // Make configuration globally available
    window.USDA_CONFIG = {
        // Whole Foods Color Palette
        COLORS: {
            primary: '#00754a',
            primaryDark: '#005a3a',
            secondary: '#f47920',
            background: '#ffffff',
            text: '#333333',
            textLight: '#666666',
            border: '#e0e0e0',
            hover: '#e8f5e9',
            error: '#d32f2f',
            success: '#2e7d32'
        },

        // API Configuration
        API_BASE_URL: 'https://api.nal.usda.gov/fdc/v1',
        API_KEY_STORAGE: 'usda_api_key',
        API_REQUESTS_STORAGE: 'usda_api_requests',
        NUTRIENT_PREFS_STORAGE: 'usda_nutrient_prefs',
        API_RATE_LIMIT: 1000,

        // Default nutrients to display
        DEFAULT_NUTRIENTS: ['Energy', 'Protein', 'Carbohydrate', 'Total lipid (fat)', 'Fiber', 'Sugars'],

        // Common nutrients list for settings
        COMMON_NUTRIENTS: [
            'Energy', 'Protein', 'Total lipid (fat)', 'Carbohydrate', 
            'Fiber', 'Sugars', 'Calcium', 'Iron', 'Magnesium', 
            'Phosphorus', 'Potassium', 'Sodium', 'Zinc', 
            'Vitamin C', 'Thiamin', 'Riboflavin', 'Niacin', 
            'Vitamin B-6', 'Folate', 'Vitamin B-12', 'Vitamin A', 
            'Vitamin E', 'Vitamin D', 'Vitamin K', 'Fatty acids, total saturated',
            'Fatty acids, total monounsaturated', 'Fatty acids, total polyunsaturated',
            'Cholesterol', 'Caffeine'
        ]
    };

    // Shared state
    window.USDA_STATE = {
        isVisible: false,
        currentResults: [],
        isDragging: false,
        dragOffset: { x: 0, y: 0 }
    };

    // Utility functions
    window.USDA_UTILS = {
        // Storage helpers
        getApiKey: function() {
            return GM_getValue(window.USDA_CONFIG.API_KEY_STORAGE, '');
        },

        setApiKey: function(key) {
            GM_setValue(window.USDA_CONFIG.API_KEY_STORAGE, key);
        },

        getNutrientPrefs: function() {
            return GM_getValue(
                window.USDA_CONFIG.NUTRIENT_PREFS_STORAGE, 
                window.USDA_CONFIG.DEFAULT_NUTRIENTS
            );
        },

        setNutrientPrefs: function(prefs) {
            GM_setValue(window.USDA_CONFIG.NUTRIENT_PREFS_STORAGE, prefs);
        },

        // Request tracking
        getRequestData: function() {
            const data = GM_getValue(window.USDA_CONFIG.API_REQUESTS_STORAGE, null);
            const now = Date.now();
            
            if (!data || now - data.timestamp > 3600000) {
                return { count: 0, timestamp: now };
            }
            
            return data;
        },

        incrementRequestCount: function() {
            const data = this.getRequestData();
            data.count += 1;
            GM_setValue(window.USDA_CONFIG.API_REQUESTS_STORAGE, data);
            
            // Dispatch event for UI updates
            document.dispatchEvent(new CustomEvent('usda:requestCountUpdated', { 
                detail: data 
            }));
        },

        resetRequestCount: function() {
            const data = { count: 0, timestamp: Date.now() };
            GM_setValue(window.USDA_CONFIG.API_REQUESTS_STORAGE, data);
            document.dispatchEvent(new CustomEvent('usda:requestCountUpdated', { 
                detail: data 
            }));
        },

        checkRateLimit: function() {
            const data = this.getRequestData();
            if (data.count >= window.USDA_CONFIG.API_RATE_LIMIT) {
                const resetTime = new Date(data.timestamp + 3600000);
                const now = new Date();
                if (now < resetTime) {
                    return {
                        limited: true,
                        message: `Rate limit reached. Resets at ${resetTime.toLocaleTimeString()}`
                    };
                }
            }
            return { limited: false };
        },

        // API request wrapper
        makeApiRequest: function(url, onSuccess, onError) {
            const rateCheck = this.checkRateLimit();
            if (rateCheck.limited) {
                if (onError) onError(rateCheck.message);
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        window.USDA_UTILS.incrementRequestCount();
                        try {
                            const data = JSON.parse(response.responseText);
                            if (onSuccess) onSuccess(data);
                        } catch (e) {
                            console.error('[USDA Core] Parse error:', e);
                            if (onError) onError('Error parsing API response');
                        }
                    } else if (response.status === 403) {
                        if (onError) onError('Invalid API key');
                    } else if (response.status === 429) {
                        if (onError) onError('Rate limit exceeded');
                    } else {
                        if (onError) onError(`API error (${response.status}): ${response.statusText}`);
                    }
                },
                onerror: function() {
                    if (onError) onError('Connection error');
                },
                ontimeout: function() {
                    if (onError) onError('Connection timeout');
                },
                timeout: 10000
            });
        },

        // Nutrient extraction helper
        getNutrient: function(nutrients, name) {
            const nutrient = nutrients.find(n => 
                n.nutrientName && n.nutrientName.toLowerCase().includes(name.toLowerCase())
            );
            return nutrient ? `${nutrient.value.toFixed(1)} ${nutrient.unitName}` : 'N/A';
        },

        // Format nutrient display name
        formatNutrientName: function(name) {
            // Shorten common long names
            const shortNames = {
                'Total lipid (fat)': 'Fat',
                'Carbohydrate, by difference': 'Carbs',
                'Fiber, total dietary': 'Fiber',
                'Sugars, total including NLEA': 'Sugars',
                'Fatty acids, total saturated': 'Saturated Fat',
                'Fatty acids, total monounsaturated': 'Monounsat. Fat',
                'Fatty acids, total polyunsaturated': 'Polyunsat. Fat'
            };
            return shortNames[name] || name;
        }
    };

    console.log('[USDA Core] Core module loaded successfully');

    // Export for testing
    try {
        module.exports = { USDA_CONFIG: window.USDA_CONFIG, USDA_UTILS: window.USDA_UTILS };
    } catch (e) {}
})();
