// UI Module - Main Interface Components
(function() {
    'use strict';

    console.log('[USDA UI] Loading UI module');

    const COLORS = window.USDA_CONFIG.COLORS;

    // Create and inject styles
    function injectStyles() {
        if (document.getElementById('usda-app-styles')) return;

        const style = document.createElement('style');
        style.id = 'usda-app-styles';
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
        `;
        document.head.appendChild(style);
    }

    // Create main UI
    function createMainUI() {
        if (document.getElementById('usda-nutrition-app')) {
            console.log('[USDA UI] UI already exists');
            return;
        }

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
        `;

        document.body.appendChild(container);
        
        // Setup toggle
        document.getElementById('usda-app-toggle').addEventListener('click', togglePanel);
        
        // Setup settings button
        document.getElementById('usda-settings-btn').addEventListener('click', () => {
            document.dispatchEvent(new Event('usda:openSettings'));
        });

        console.log('[USDA UI] Main UI created');
    }

    function togglePanel() {
        window.USDA_STATE.isVisible = !window.USDA_STATE.isVisible;
        const panel = document.getElementById('usda-app-panel');
        panel.style.display = window.USDA_STATE.isVisible ? 'flex' : 'none';
    }

    // Initialize
    function init() {
        injectStyles();
        createMainUI();
    }

    // Wait for DOM and Core module
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for testing
    try {
        module.exports = { createMainUI, togglePanel };
    } catch (e) {}

    console.log('[USDA UI] UI module loaded successfully');
})();
