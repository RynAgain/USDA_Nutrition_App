// ==UserScript==
// @name         USDA Nutrition Lookup - Whole Foods Theme
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Query USDA FoodData Central API with a Whole Foods themed interface
// @author       RynAgain
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.nal.usda.gov
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/usda-nutrition-lookup.user.js
// @downloadURL  https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/usda-nutrition-lookup.user.js
// @supportURL   https://github.com/RynAgain/USDA_Nutrition_App/issues
// @homepageURL  https://github.com/RynAgain/USDA_Nutrition_App
// ==/UserScript==

(function() {
    'use strict';

    // Whole Foods Color Palette
    const COLORS = {
        primary: '#00754a',      // Whole Foods Green
        primaryDark: '#005a3a',
        secondary: '#f47920',    // Whole Foods Orange
        background: '#ffffff',
        text: '#333333',
        textLight: '#666666',
        border: '#e0e0e0',
        hover: '#e8f5e9',
        error: '#d32f2f',
        success: '#2e7d32'
    };

    // API Configuration
    const API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
    const API_KEY_STORAGE = 'usda_api_key';

    // State Management
    let isVisible = false;
    let currentResults = [];

    // Create Main Container
    function createMainUI() {
        const container = document.createElement('div');
        container.id = 'usda-nutrition-app';
        container.innerHTML = `
            <div id="usda-app-toggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
            </div>
            <div id="usda-app-panel" style="display: none;">
                <div id="usda-app-header">
                    <div class="usda-logo">
                        <span style="font-size: 32px;">🍗</span>
                        <h2>USDA Nutrition Lookup</h2>
                    </div>
                    <button id="usda-settings-btn" title="Settings">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                        </svg>
                    </button>
                </div>
                <div id="usda-app-content">
                    <div id="usda-search-section">
                        <div class="usda-search-bar">
                            <input type="text" id="usda-search-input" placeholder="Search for food items (e.g., 'apple', 'chicken breast')...">
                            <button id="usda-search-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                                Search
                            </button>
                        </div>
                        <div class="usda-search-options">
                            <label>
                                <input type="checkbox" id="usda-branded" checked>
                                Branded Foods
                            </label>
                            <label>
                                <input type="checkbox" id="usda-foundation" checked>
                                Foundation Foods
                            </label>
                            <label>
                                <input type="checkbox" id="usda-survey" checked>
                                Survey Foods
                            </label>
                        </div>
                    </div>
                    <div id="usda-results-section">
                        <div id="usda-results-container"></div>
                    </div>
                </div>
            </div>
            <div id="usda-settings-modal" style="display: none;">
                <div class="usda-modal-content">
                    <div class="usda-modal-header">
                        <h3>Settings</h3>
                        <button id="usda-close-settings">&times;</button>
                    </div>
                    <div class="usda-modal-body">
                        <div class="usda-form-group">
                            <label for="usda-api-key-input">USDA FoodData Central API Key</label>
                            <input type="password" id="usda-api-key-input" placeholder="Enter your API key">
                            <small>Get your free API key at <a href="https://fdc.nal.usda.gov/api-key-signup.html" target="_blank">FoodData Central</a></small>
                        </div>
                        <div class="usda-form-group">
                            <button id="usda-save-settings" class="usda-btn-primary">Save Settings</button>
                            <button id="usda-test-api" class="usda-btn-secondary">Test API Connection</button>
                        </div>
                        <div id="usda-settings-message"></div>
                    </div>
                </div>
            </div>
        `;

        // Add Styles
        const style = document.createElement('style');
        style.textContent = `
            #usda-nutrition-app * {
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }

            #usda-app-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                background: ${COLORS.primary};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 117, 74, 0.4);
                z-index: 999999;
                transition: all 0.3s ease;
            }

            #usda-app-toggle:hover {
                background: ${COLORS.primaryDark};
                transform: scale(1.1);
            }

            #usda-app-panel {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 450px;
                max-height: 600px;
                background: ${COLORS.background};
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                z-index: 999998;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            #usda-app-header {
                background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%);
                color: white;
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .usda-logo {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .usda-logo svg {
                fill: white;
            }

            .usda-logo h2 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            #usda-settings-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }

            #usda-settings-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            #usda-app-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .usda-search-bar {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
            }

            #usda-search-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid ${COLORS.border};
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            #usda-search-input:focus {
                outline: none;
                border-color: ${COLORS.primary};
            }

            #usda-search-btn {
                background: ${COLORS.primary};
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background 0.2s;
            }

            #usda-search-btn:hover {
                background: ${COLORS.primaryDark};
            }

            .usda-search-options {
                display: flex;
                gap: 16px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            .usda-search-options label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: ${COLORS.textLight};
                cursor: pointer;
            }

            .usda-search-options input[type="checkbox"] {
                cursor: pointer;
            }

            #usda-results-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .usda-result-card {
                background: ${COLORS.background};
                border: 1px solid ${COLORS.border};
                border-radius: 8px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .usda-result-card:hover {
                border-color: ${COLORS.primary};
                box-shadow: 0 2px 8px rgba(0, 117, 74, 0.1);
            }

            .usda-result-title {
                font-weight: 600;
                color: ${COLORS.text};
                margin-bottom: 8px;
                font-size: 15px;
            }

            .usda-result-meta {
                display: flex;
                gap: 12px;
                font-size: 12px;
                color: ${COLORS.textLight};
                margin-bottom: 8px;
            }

            .usda-result-badge {
                background: ${COLORS.hover};
                color: ${COLORS.primary};
                padding: 2px 8px;
                border-radius: 4px;
                font-weight: 500;
            }

            .usda-result-nutrients {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid ${COLORS.border};
            }

            .usda-nutrient-item {
                font-size: 12px;
            }

            .usda-nutrient-label {
                color: ${COLORS.textLight};
                display: block;
            }

            .usda-nutrient-value {
                color: ${COLORS.text};
                font-weight: 600;
            }

            #usda-settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .usda-modal-content {
                background: ${COLORS.background};
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            }

            .usda-modal-header {
                background: ${COLORS.primary};
                color: white;
                padding: 20px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .usda-modal-header h3 {
                margin: 0;
                font-size: 20px;
            }

            #usda-close-settings {
                background: none;
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 32px;
                height: 32px;
            }

            .usda-modal-body {
                padding: 24px;
            }

            .usda-form-group {
                margin-bottom: 20px;
            }

            .usda-form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: ${COLORS.text};
            }

            .usda-form-group input[type="password"],
            .usda-form-group input[type="text"] {
                width: 100%;
                padding: 12px;
                border: 2px solid ${COLORS.border};
                border-radius: 8px;
                font-size: 14px;
            }

            .usda-form-group input:focus {
                outline: none;
                border-color: ${COLORS.primary};
            }

            .usda-form-group small {
                display: block;
                margin-top: 6px;
                color: ${COLORS.textLight};
                font-size: 12px;
            }

            .usda-form-group small a {
                color: ${COLORS.primary};
                text-decoration: none;
            }

            .usda-form-group small a:hover {
                text-decoration: underline;
            }

            .usda-btn-primary,
            .usda-btn-secondary {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                margin-right: 8px;
            }

            .usda-btn-primary {
                background: ${COLORS.primary};
                color: white;
            }

            .usda-btn-primary:hover {
                background: ${COLORS.primaryDark};
            }

            .usda-btn-secondary {
                background: ${COLORS.border};
                color: ${COLORS.text};
            }

            .usda-btn-secondary:hover {
                background: #d0d0d0;
            }

            #usda-settings-message {
                margin-top: 16px;
                padding: 12px;
                border-radius: 8px;
                font-size: 14px;
                display: none;
            }

            #usda-settings-message.success {
                background: #e8f5e9;
                color: ${COLORS.success};
                display: block;
            }

            #usda-settings-message.error {
                background: #ffebee;
                color: ${COLORS.error};
                display: block;
            }

            .usda-loading {
                text-align: center;
                padding: 40px;
                color: ${COLORS.textLight};
            }

            .usda-spinner {
                border: 3px solid ${COLORS.border};
                border-top: 3px solid ${COLORS.primary};
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .usda-empty-state {
                text-align: center;
                padding: 40px 20px;
                color: ${COLORS.textLight};
            }

            .usda-empty-state svg {
                margin-bottom: 16px;
                opacity: 0.5;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(container);

        initializeEventListeners();
        checkApiKey();
    }

    // Initialize Event Listeners
    function initializeEventListeners() {
        // Toggle Panel
        document.getElementById('usda-app-toggle').addEventListener('click', togglePanel);

        // Settings
        document.getElementById('usda-settings-btn').addEventListener('click', openSettings);
        document.getElementById('usda-close-settings').addEventListener('click', closeSettings);
        document.getElementById('usda-save-settings').addEventListener('click', saveSettings);
        document.getElementById('usda-test-api').addEventListener('click', testApiConnection);

        // Search
        document.getElementById('usda-search-btn').addEventListener('click', performSearch);
        document.getElementById('usda-search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        // Close modal on outside click
        document.getElementById('usda-settings-modal').addEventListener('click', (e) => {
            if (e.target.id === 'usda-settings-modal') closeSettings();
        });
    }

    // Toggle Panel Visibility
    function togglePanel() {
        isVisible = !isVisible;
        const panel = document.getElementById('usda-app-panel');
        panel.style.display = isVisible ? 'flex' : 'none';
    }

    // Settings Functions
    function openSettings() {
        const modal = document.getElementById('usda-settings-modal');
        const input = document.getElementById('usda-api-key-input');
        const apiKey = GM_getValue(API_KEY_STORAGE, '');
        input.value = apiKey;
        modal.style.display = 'flex';
    }

    function closeSettings() {
        document.getElementById('usda-settings-modal').style.display = 'none';
        document.getElementById('usda-settings-message').className = '';
        document.getElementById('usda-settings-message').style.display = 'none';
    }

    function saveSettings() {
        const apiKey = document.getElementById('usda-api-key-input').value.trim();
        const messageEl = document.getElementById('usda-settings-message');

        if (!apiKey) {
            messageEl.textContent = 'Please enter an API key';
            messageEl.className = 'error';
            return;
        }

        GM_setValue(API_KEY_STORAGE, apiKey);
        messageEl.textContent = 'API key saved successfully!';
        messageEl.className = 'success';

        setTimeout(() => {
            closeSettings();
        }, 1500);
    }

    function testApiConnection() {
        const apiKey = document.getElementById('usda-api-key-input').value.trim();
        const messageEl = document.getElementById('usda-settings-message');

        if (!apiKey) {
            messageEl.textContent = 'Please enter an API key first';
            messageEl.className = 'error';
            return;
        }

        messageEl.textContent = 'Testing connection...';
        messageEl.className = 'success';
        messageEl.style.display = 'block';

        // Test with a simple search
        const testUrl = `${API_BASE_URL}/foods/search?query=apple&pageSize=1&api_key=${encodeURIComponent(apiKey)}`;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: testUrl,
            onload: function(response) {
                console.log('API Test Response:', response.status, response.statusText);
                console.log('Response Text:', response.responseText);
                
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.foods && data.foods.length >= 0) {
                            messageEl.textContent = 'API connection successful! ✓';
                            messageEl.className = 'success';
                        } else {
                            messageEl.textContent = 'Unexpected API response format';
                            messageEl.className = 'error';
                        }
                    } catch (e) {
                        messageEl.textContent = 'Error parsing API response';
                        messageEl.className = 'error';
                        console.error('Parse error:', e);
                    }
                } else if (response.status === 403) {
                    messageEl.textContent = 'Invalid API key. Please check your key.';
                    messageEl.className = 'error';
                } else if (response.status === 429) {
                    messageEl.textContent = 'Rate limit exceeded. Please try again later.';
                    messageEl.className = 'error';
                } else {
                    messageEl.textContent = `API test failed (${response.status}): ${response.statusText}`;
                    messageEl.className = 'error';
                }
            },
            onerror: function(error) {
                console.error('API Test Error:', error);
                messageEl.textContent = 'Connection error. Please check your internet connection.';
                messageEl.className = 'error';
            },
            ontimeout: function() {
                messageEl.textContent = 'Connection timeout. Please try again.';
                messageEl.className = 'error';
            },
            timeout: 10000
        });
    }

    function checkApiKey() {
        const apiKey = GM_getValue(API_KEY_STORAGE, '');
        if (!apiKey) {
            setTimeout(() => {
                openSettings();
            }, 1000);
        }
    }

    // Search Functions
    function performSearch() {
        const query = document.getElementById('usda-search-input').value.trim();
        const apiKey = GM_getValue(API_KEY_STORAGE, '');

        if (!apiKey) {
            showMessage('Please set your API key in settings first', 'error');
            openSettings();
            return;
        }

        if (!query) {
            showMessage('Please enter a search term', 'error');
            return;
        }

        // Get selected data types
        const dataTypes = [];
        if (document.getElementById('usda-branded').checked) dataTypes.push('Branded');
        if (document.getElementById('usda-foundation').checked) dataTypes.push('Foundation');
        if (document.getElementById('usda-survey').checked) dataTypes.push('Survey (FNDDS)');

        if (dataTypes.length === 0) {
            showMessage('Please select at least one food type', 'error');
            return;
        }

        showLoading();

        const dataTypeParam = dataTypes.join(',');
        const url = `${API_BASE_URL}/foods/search?query=${encodeURIComponent(query)}&dataType=${encodeURIComponent(dataTypeParam)}&pageSize=25&api_key=${apiKey}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    displayResults(data.foods || []);
                } else {
                    showMessage(`Search failed: ${response.statusText}`, 'error');
                }
            },
            onerror: function() {
                showMessage('Connection error. Please try again.', 'error');
            }
        });
    }

    function showLoading() {
        const container = document.getElementById('usda-results-container');
        container.innerHTML = `
            <div class="usda-loading">
                <div class="usda-spinner"></div>
                <p>Searching USDA database...</p>
            </div>
        `;
    }

    function displayResults(foods) {
        const container = document.getElementById('usda-results-container');

        if (foods.length === 0) {
            container.innerHTML = `
                <div class="usda-empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="${COLORS.textLight}">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <p>No results found. Try a different search term.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = foods.map(food => createFoodCard(food)).join('');
    }

    function createFoodCard(food) {
        const nutrients = food.foodNutrients || [];
        
        // Extract key nutrients
        const getNutrient = (name) => {
            const nutrient = nutrients.find(n => n.nutrientName && n.nutrientName.toLowerCase().includes(name.toLowerCase()));
            return nutrient ? `${nutrient.value.toFixed(1)} ${nutrient.unitName}` : 'N/A';
        };

        const calories = getNutrient('energy');
        const protein = getNutrient('protein');
        const carbs = getNutrient('carbohydrate');
        const fat = getNutrient('total lipid');

        return `
            <div class="usda-result-card" onclick="window.open('https://fdc.nal.usda.gov/fdc-app.html#/food-details/${food.fdcId}/nutrients', '_blank')">
                <div class="usda-result-title">${food.description || 'Unknown Food'}</div>
                <div class="usda-result-meta">
                    <span class="usda-result-badge">${food.dataType || 'Unknown'}</span>
                    ${food.brandOwner ? `<span>Brand: ${food.brandOwner}</span>` : ''}
                </div>
                ${nutrients.length > 0 ? `
                    <div class="usda-result-nutrients">
                        <div class="usda-nutrient-item">
                            <span class="usda-nutrient-label">Calories</span>
                            <span class="usda-nutrient-value">${calories}</span>
                        </div>
                        <div class="usda-nutrient-item">
                            <span class="usda-nutrient-label">Protein</span>
                            <span class="usda-nutrient-value">${protein}</span>
                        </div>
                        <div class="usda-nutrient-item">
                            <span class="usda-nutrient-label">Carbs</span>
                            <span class="usda-nutrient-value">${carbs}</span>
                        </div>
                        <div class="usda-nutrient-item">
                            <span class="usda-nutrient-label">Fat</span>
                            <span class="usda-nutrient-value">${fat}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    function showMessage(message, type) {
        const container = document.getElementById('usda-results-container');
        const className = type === 'error' ? 'error' : 'success';
        container.innerHTML = `
            <div class="usda-empty-state">
                <p style="color: ${type === 'error' ? COLORS.error : COLORS.success}">${message}</p>
            </div>
        `;
    }

    // Initialize the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMainUI);
    } else {
        createMainUI();
    }
})();
