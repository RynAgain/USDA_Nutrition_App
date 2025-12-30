// ==UserScript==
// @name         USDA Nutrition Lookup - Whole Foods Theme
// @namespace    http://tampermonkey.net/
// @version      1.1.0
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
    const API_REQUESTS_STORAGE = 'usda_api_requests';
    const NUTRIENT_PREFS_STORAGE = 'usda_nutrient_prefs';
    const API_RATE_LIMIT = 1000; // 1000 requests per hour

    // Default nutrients to display
    const DEFAULT_NUTRIENTS = ['Energy', 'Protein', 'Carbohydrate', 'Total lipid (fat)', 'Fiber', 'Sugars'];

    // State Management
    let isVisible = false;
    let currentResults = [];
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

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
                    <div class="usda-logo" id="usda-drag-handle" style="cursor: move;">
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
                        <div class="usda-search-mode">
                            <label>
                                <input type="radio" name="search-mode" value="text" checked>
                                Text Search
                            </label>
                            <label>
                                <input type="radio" name="search-mode" value="fdc">
                                FDC ID
                            </label>
                            <label>
                                <input type="radio" name="search-mode" value="ndb">
                                NDB Number
                            </label>
                        </div>
                        <div class="usda-search-bar">
                            <input type="text" id="usda-search-input" placeholder="Search for food items (e.g., 'apple', 'chicken breast')...">
                            <button id="usda-search-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                                Search
                            </button>
                        </div>
                        <div class="usda-search-options" id="usda-data-type-filters">
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
                            <label>API Usage Tracker</label>
                            <div class="usda-usage-tracker">
                                <div class="usda-usage-info">
                                    <span id="usda-request-count">0</span> / ${API_RATE_LIMIT} requests this hour
                                </div>
                                <div class="usda-usage-bar">
                                    <div class="usda-usage-fill" id="usda-usage-fill" style="width: 0%"></div>
                                </div>
                                <small>Resets at: <span id="usda-reset-time">--:--</span></small>
                            </div>
                            <button id="usda-reset-counter" class="usda-btn-secondary" style="margin-top: 8px;">Reset Counter</button>
                        </div>
                        <div class="usda-form-group">
                            <label>Display Nutrients (select up to 6)</label>
                            <div id="usda-nutrient-checkboxes" class="usda-nutrient-grid"></div>
                        </div>
                        <div class="usda-form-group">
                            <button id="usda-save-settings" class="usda-btn-primary">Save Settings</button>
                            <button id="usda-test-api" class="usda-btn-secondary">Test API Connection</button>
                        </div>
                        <div id="usda-settings-message"></div>
                    </div>
                </div>
            </div>
            <div id="usda-detail-modal" style="display: none;">
                <div class="usda-modal-content usda-detail-content">
                    <div class="usda-modal-header">
                        <h3 id="usda-detail-title">Food Details</h3>
                        <button id="usda-close-detail">&times;</button>
                    </div>
                    <div class="usda-modal-body" id="usda-detail-body">
                        <!-- Details will be populated here -->
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

            #usda-app-panel.dragging {
                cursor: move;
                user-select: none;
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

            .usda-search-mode {
                display: flex;
                gap: 16px;
                margin-bottom: 12px;
                padding: 12px;
                background: ${COLORS.hover};
                border-radius: 8px;
            }

            .usda-search-mode label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                font-weight: 500;
                color: ${COLORS.text};
                cursor: pointer;
            }

            .usda-search-mode input[type="radio"] {
                cursor: pointer;
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
                flex-wrap: wrap;
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

            #usda-settings-modal, #usda-detail-modal {
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
                max-height: 90vh;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
            }

            .usda-detail-content {
                max-width: 700px;
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

            #usda-close-settings, #usda-close-detail {
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
                overflow-y: auto;
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

            .usda-nutrient-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
                max-height: 200px;
                overflow-y: auto;
                padding: 12px;
                background: ${COLORS.hover};
                border-radius: 8px;
            }

            .usda-nutrient-grid label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                font-weight: normal;
                cursor: pointer;
                margin-bottom: 0;
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

            .usda-usage-tracker {
                background: ${COLORS.hover};
                padding: 16px;
                border-radius: 8px;
                margin-top: 8px;
            }

            .usda-usage-info {
                font-size: 14px;
                font-weight: 600;
                color: ${COLORS.text};
                margin-bottom: 12px;
            }

            .usda-usage-info span {
                color: ${COLORS.primary};
                font-size: 18px;
            }

            .usda-usage-bar {
                height: 24px;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                margin-bottom: 8px;
                border: 2px solid ${COLORS.border};
            }

            .usda-usage-fill {
                height: 100%;
                background: linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
                transition: width 0.3s ease, background 0.3s ease;
            }

            .usda-usage-fill.warning {
                background: linear-gradient(90deg, ${COLORS.secondary} 0%, #ff9800 100%);
            }

            .usda-usage-fill.danger {
                background: linear-gradient(90deg, #ff9800 0%, ${COLORS.error} 100%);
            }

            .usda-usage-tracker small {
                display: block;
                color: ${COLORS.textLight};
                font-size: 12px;
            }

            .usda-detail-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                margin-top: 16px;
            }

            .usda-detail-item {
                padding: 12px;
                background: ${COLORS.hover};
                border-radius: 8px;
            }

            .usda-detail-item strong {
                display: block;
                color: ${COLORS.text};
                margin-bottom: 4px;
            }

            .usda-detail-item span {
                color: ${COLORS.primary};
                font-size: 18px;
                font-weight: 600;
            }

            .usda-detail-section {
                margin-top: 20px;
            }

            .usda-detail-section h4 {
                color: ${COLORS.primary};
                margin-bottom: 12px;
            }

            .usda-external-link {
                display: inline-block;
                margin-top: 16px;
                padding: 10px 20px;
                background: ${COLORS.primary};
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: background 0.2s;
            }

            .usda-external-link:hover {
                background: ${COLORS.primaryDark};
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(container);

        initializeEventListeners();
        initializeDragging();
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
        document.getElementById('usda-reset-counter').addEventListener('click', resetRequestCounter);

        // Detail modal
        document.getElementById('usda-close-detail').addEventListener('click', closeDetailModal);

        // Search
        document.getElementById('usda-search-btn').addEventListener('click', performSearch);
        document.getElementById('usda-search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        // Search mode change
        document.querySelectorAll('input[name="search-mode"]').forEach(radio => {
            radio.addEventListener('change', updateSearchMode);
        });

        // Close modals on outside click
        document.getElementById('usda-settings-modal').addEventListener('click', (e) => {
            if (e.target.id === 'usda-settings-modal') closeSettings();
        });
        document.getElementById('usda-detail-modal').addEventListener('click', (e) => {
            if (e.target.id === 'usda-detail-modal') closeDetailModal();
        });
    }

    // Initialize Dragging
    function initializeDragging() {
        const panel = document.getElementById('usda-app-panel');
        const dragHandle = document.getElementById('usda-drag-handle');

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            panel.classList.add('dragging');
            
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const panel = document.getElementById('usda-app-panel');
            let newX = e.clientX - dragOffset.x;
            let newY = e.clientY - dragOffset.y;
            
            // Keep panel within viewport
            newX = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight));
            
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        });

        document.addEventListener('
