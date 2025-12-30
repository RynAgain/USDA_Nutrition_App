// ==UserScript==
// @name         USDA Nutrition Lookup - Whole Foods Theme
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Query USDA FoodData Central API with a Whole Foods themed interface (Modular Architecture)
// @author       RynAgain
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.nal.usda.gov
// @run-at       document-end
// @require      https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/JS/Core.js
// @require      https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/JS/UI.js
// @require      https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/JS/Search.js
// @require      https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/JS/Settings.js
// @require      https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/JS/Dragging.js
// @require      https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/JS/DetailView.js
// @updateURL    https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/usda-nutrition-lookup-modular.user.js
// @downloadURL  https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/usda-nutrition-lookup-modular.user.js
// @supportURL   https://github.com/RynAgain/USDA_Nutrition_App/issues
// @homepageURL  https://github.com/RynAgain/USDA_Nutrition_App
// ==/UserScript==

(function() {
    'use strict';

    console.log('='.repeat(60));
    console.log('USDA Nutrition Lookup - Whole Foods Theme v2.0.0');
    console.log('Modular Architecture');
    console.log('='.repeat(60));

    // All modules are loaded via @require directives above
    // Modules loaded in order:
    // 1. Core.js - Configuration and utilities
    // 2. UI.js - Main interface components
    // 3. Search.js - Search functionality
    // 4. Settings.js - Settings modal
    // 5. Dragging.js - Panel dragging
    // 6. DetailView.js - Detailed food information

    // Verify all modules loaded
    const requiredGlobals = ['USDA_CONFIG', 'USDA_STATE', 'USDA_UTILS'];
    const missingGlobals = requiredGlobals.filter(g => !window[g]);
    
    if (missingGlobals.length > 0) {
        console.error('[USDA Main] Missing required globals:', missingGlobals);
        console.error('[USDA Main] Please ensure all module files are accessible');
        return;
    }

    console.log('[USDA Main] All modules loaded successfully');
    console.log('[USDA Main] Configuration:', {
        apiBaseUrl: window.USDA_CONFIG.API_BASE_URL,
        rateLimit: window.USDA_CONFIG.API_RATE_LIMIT,
        defaultNutrients: window.USDA_CONFIG.DEFAULT_NUTRIENTS.length
    });

    // Log module status
    console.log('[USDA Main] Module Status:');
    console.log('  ✓ Core Module - Configuration and utilities');
    console.log('  ✓ UI Module - Main interface');
    console.log('  ✓ Search Module - Search functionality');
    console.log('  ✓ Settings Module - Settings management');
    console.log('  ✓ Dragging Module - Panel dragging');
    console.log('  ✓ DetailView Module - Detailed food view');

    console.log('='.repeat(60));
    console.log('USDA Nutrition Lookup initialized successfully!');
    console.log('Click the green button in the bottom-right to get started.');
    console.log('='.repeat(60));

    // Optional: Add keyboard shortcut to toggle panel
    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+U to toggle
        if (e.ctrlKey && e.shiftKey && e.key === 'U') {
            const toggle = document.getElementById('usda-app-toggle');
            if (toggle) {
                toggle.click();
            }
        }
    });

    console.log('[USDA Main] Keyboard shortcut: Ctrl+Shift+U to toggle panel');
})();
