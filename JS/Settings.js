// Settings Module - Manages settings modal and preferences
(function() {
    'use strict';

    console.log('[USDA Settings] Loading settings module');

    const COLORS = window.USDA_CONFIG.COLORS;
    const API_BASE_URL = window.USDA_CONFIG.API_BASE_URL;
    const API_RATE_LIMIT = window.USDA_CONFIG.API_RATE_LIMIT;

    // Inject settings modal styles
    function injectStyles() {
        if (document.getElementById('usda-settings-styles')) return;

        const style = document.createElement('style');
        style.id = 'usda-settings-styles';
        style.textContent = `
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
                max-height: 90vh;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
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
        `;
        document.head.appendChild(style);
    }

    // Create settings modal
    function createSettingsModal() {
        if (document.getElementById('usda-settings-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'usda-settings-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
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
        `;

        document.body.appendChild(modal);

        // Wire up events
        document.getElementById('usda-close-settings').addEventListener('click', closeSettings);
        document.getElementById('usda-save-settings').addEventListener('click', saveSettings);
        document.getElementById('usda-test-api').addEventListener('click', testApiConnection);
        document.getElementById('usda-reset-counter').addEventListener('click', resetRequestCounter);
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'usda-settings-modal') closeSettings();
        });

        // Populate nutrient checkboxes
        populateNutrientCheckboxes();

        console.log('[USDA Settings] Settings modal created');
    }

    // Populate nutrient checkboxes
    function populateNutrientCheckboxes() {
        const container = document.getElementById('usda-nutrient-checkboxes');
        if (!container) return;

        const prefs = window.USDA_UTILS.getNutrientPrefs();
        const commonNutrients = window.USDA_CONFIG.COMMON_NUTRIENTS;

        container.innerHTML = commonNutrients.map(nutrient => {
            const checked = prefs.includes(nutrient) ? 'checked' : '';
            const id = `nutrient-${nutrient.replace(/[^a-zA-Z0-9]/g, '-')}`;
            return `
                <label>
                    <input type="checkbox" id="${id}" value="${nutrient}" ${checked}>
                    ${window.USDA_UTILS.formatNutrientName(nutrient)}
                </label>
            `;
        }).join('');

        // Limit to 6 selections
        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checked = container.querySelectorAll('input[type="checkbox"]:checked');
                if (checked.length > 6) {
                    checkbox.checked = false;
                    showMessage('You can select up to 6 nutrients', 'error');
                }
            });
        });
    }

    // Open settings
    function openSettings() {
        const modal = document.getElementById('usda-settings-modal');
        if (!modal) return;

        const input = document.getElementById('usda-api-key-input');
        input.value = window.USDA_UTILS.getApiKey();
        
        updateUsageDisplay();
        modal.style.display = 'flex';
    }

    // Close settings
    function closeSettings() {
        const modal = document.getElementById('usda-settings-modal');
        if (modal) {
            modal.style.display = 'none';
            const message = document.getElementById('usda-settings-message');
            if (message) {
                message.className = '';
                message.style.display = 'none';
            }
        }
    }

    // Save settings
    function saveSettings() {
        const apiKey = document.getElementById('usda-api-key-input').value.trim();
        
        if (!apiKey) {
            showMessage('Please enter an API key', 'error');
            return;
        }

        window.USDA_UTILS.setApiKey(apiKey);

        // Save nutrient preferences
        const selected = Array.from(document.querySelectorAll('#usda-nutrient-checkboxes input:checked'))
            .map(cb => cb.value);
        window.USDA_UTILS.setNutrientPrefs(selected);

        showMessage('Settings saved successfully!', 'success');

        setTimeout(() => {
            closeSettings();
        }, 1500);
    }

    // Test API connection
    function testApiConnection() {
        const apiKey = document.getElementById('usda-api-key-input').value.trim();
        
        if (!apiKey) {
            showMessage('Please enter an API key first', 'error');
            return;
        }

        showMessage('Testing connection...', 'success');

        const url = `${API_BASE_URL}/foods/search?query=apple&pageSize=1&api_key=${encodeURIComponent(apiKey)}`;
        
        window.USDA_UTILS.makeApiRequest(
            url,
            () => showMessage('API connection successful! ✓', 'success'),
            (error) => showMessage(`API test failed: ${error}`, 'error')
        );
    }

    // Reset request counter
    function resetRequestCounter() {
        window.USDA_UTILS.resetRequestCount();
        updateUsageDisplay();
        showMessage('Request counter reset successfully!', 'success');
        
        setTimeout(() => {
            const message = document.getElementById('usda-settings-message');
            if (message) {
                message.className = '';
                message.style.display = 'none';
            }
        }, 2000);
    }

    // Update usage display
    function updateUsageDisplay() {
        const data = window.USDA_UTILS.getRequestData();
        const countEl = document.getElementById('usda-request-count');
        const fillEl = document.getElementById('usda-usage-fill');
        const resetTimeEl = document.getElementById('usda-reset-time');
        
        if (countEl) {
            countEl.textContent = data.count;
            
            const percentage = (data.count / API_RATE_LIMIT) * 100;
            fillEl.style.width = `${Math.min(percentage, 100)}%`;
            
            fillEl.className = 'usda-usage-fill';
            if (percentage >= 90) {
                fillEl.classList.add('danger');
            } else if (percentage >= 70) {
                fillEl.classList.add('warning');
            }
            
            const resetTime = new Date(data.timestamp + 3600000);
            resetTimeEl.textContent = resetTime.toLocaleTimeString();
        }
    }

    // Show message
    function showMessage(message, type) {
        const messageEl = document.getElementById('usda-settings-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = type;
            messageEl.style.display = 'block';
        }
    }

    // Listen for open settings event
    document.addEventListener('usda:openSettings', openSettings);

    // Listen for request count updates
    document.addEventListener('usda:requestCountUpdated', updateUsageDisplay);

    // Initialize
    function init() {
        injectStyles();
        createSettingsModal();
        
        // Check if API key exists, if not open settings
        if (!window.USDA_UTILS.getApiKey()) {
            setTimeout(openSettings, 1000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for testing
    try {
        module.exports = { openSettings, closeSettings, saveSettings };
    } catch (e) {}

    console.log('[USDA Settings] Settings module loaded successfully');
})();
