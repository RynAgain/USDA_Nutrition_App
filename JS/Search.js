// Search Module - Handles all search functionality
(function() {
    'use strict';

    console.log('[USDA Search] Loading search module');

    const API_BASE_URL = window.USDA_CONFIG.API_BASE_URL;

    // Update search mode UI
    function updateSearchMode() {
        const mode = document.querySelector('input[name="search-mode"]:checked').value;
        const searchInput = document.getElementById('usda-search-input');
        const dataTypeFilters = document.getElementById('usda-data-type-filters');

        if (mode === 'text') {
            searchInput.placeholder = "Search for food items (e.g., 'apple', 'chicken breast')...";
            dataTypeFilters.style.display = 'flex';
        } else if (mode === 'fdc') {
            searchInput.placeholder = "Enter FDC ID (e.g., '534358')...";
            dataTypeFilters.style.display = 'none';
        } else if (mode === 'ndb') {
            searchInput.placeholder = "Enter NDB Number (e.g., '09003')...";
            dataTypeFilters.style.display = 'none';
        }
    }

    // Perform search
    function performSearch() {
        const query = document.getElementById('usda-search-input').value.trim();
        const apiKey = window.USDA_UTILS.getApiKey();
        const searchMode = document.querySelector('input[name="search-mode"]:checked').value;

        if (!apiKey) {
            showMessage('Please set your API key in settings first', 'error');
            document.dispatchEvent(new Event('usda:openSettings'));
            return;
        }

        if (!query) {
            showMessage('Please enter a search term', 'error');
            return;
        }

        showLoading();

        if (searchMode === 'fdc') {
            searchByFdcId(query, apiKey);
        } else if (searchMode === 'ndb') {
            searchByNdbNumber(query, apiKey);
        } else {
            performTextSearch(query, apiKey);
        }
    }

    // Text search
    function performTextSearch(query, apiKey) {
        const dataTypes = [];
        if (document.getElementById('usda-branded').checked) dataTypes.push('Branded');
        if (document.getElementById('usda-foundation').checked) dataTypes.push('Foundation');
        if (document.getElementById('usda-survey').checked) dataTypes.push('Survey (FNDDS)');

        if (dataTypes.length === 0) {
            showMessage('Please select at least one food type', 'error');
            return;
        }

        const dataTypeParam = dataTypes.join(',');
        const url = `${API_BASE_URL}/foods/search?query=${encodeURIComponent(query)}&dataType=${encodeURIComponent(dataTypeParam)}&pageSize=25&api_key=${apiKey}`;

        window.USDA_UTILS.makeApiRequest(
            url,
            (data) => displayResults(data.foods || []),
            (error) => showMessage(error, 'error')
        );
    }

    // Search by FDC ID
    function searchByFdcId(fdcId, apiKey) {
        const url = `${API_BASE_URL}/food/${encodeURIComponent(fdcId)}?api_key=${apiKey}`;

        window.USDA_UTILS.makeApiRequest(
            url,
            (food) => displayResults([food]),
            (error) => {
                if (error.includes('404')) {
                    showMessage('Food not found with that FDC ID', 'error');
                } else {
                    showMessage(error, 'error');
                }
            }
        );
    }

    // Search by NDB Number
    function searchByNdbNumber(ndbNumber, apiKey) {
        const url = `${API_BASE_URL}/foods/search?query=${encodeURIComponent(ndbNumber)}&pageSize=25&api_key=${apiKey}`;

        window.USDA_UTILS.makeApiRequest(
            url,
            (data) => {
                const filtered = (data.foods || []).filter(food => 
                    food.ndbNumber && food.ndbNumber.toString() === ndbNumber.toString()
                );
                
                if (filtered.length > 0) {
                    displayResults(filtered);
                } else if (data.foods && data.foods.length > 0) {
                    displayResults(data.foods);
                } else {
                    showMessage('No food found with that NDB Number', 'error');
                }
            },
            (error) => showMessage(error, 'error')
        );
    }

    // Display results
    function displayResults(foods) {
        const container = document.getElementById('usda-results-container');
        window.USDA_STATE.currentResults = foods;

        if (foods.length === 0) {
            container.innerHTML = `
                <div class="usda-empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="${window.USDA_CONFIG.COLORS.textLight}">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <p>No results found. Try a different search term.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = foods.map((food, index) => createFoodCard(food, index)).join('');

        // Add click handlers
        foods.forEach((food, index) => {
            const card = container.children[index];
            if (card) {
                card.addEventListener('click', () => {
                    document.dispatchEvent(new CustomEvent('usda:showDetail', { detail: food }));
                });
            }
        });
    }

    // Create food card
    function createFoodCard(food, index) {
        const nutrients = food.foodNutrients || [];
        const prefs = window.USDA_UTILS.getNutrientPrefs();
        
        // Get preferred nutrients
        const nutrientItems = prefs.slice(0, 6).map(prefName => {
            const value = window.USDA_UTILS.getNutrient(nutrients, prefName);
            const displayName = window.USDA_UTILS.formatNutrientName(prefName);
            return `
                <div class="usda-nutrient-item">
                    <span class="usda-nutrient-label">${displayName}</span>
                    <span class="usda-nutrient-value">${value}</span>
                </div>
            `;
        }).join('');

        return `
            <div class="usda-result-card" data-index="${index}">
                <div class="usda-result-title">${food.description || 'Unknown Food'}</div>
                <div class="usda-result-meta">
                    <span class="usda-result-badge">${food.dataType || 'Unknown'}</span>
                    ${food.brandOwner ? `<span>Brand: ${food.brandOwner}</span>` : ''}
                    ${food.fdcId ? `<span>FDC: ${food.fdcId}</span>` : ''}
                </div>
                ${nutrients.length > 0 ? `
                    <div class="usda-result-nutrients">
                        ${nutrientItems}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Show loading
    function showLoading() {
        const container = document.getElementById('usda-results-container');
        container.innerHTML = `
            <div class="usda-loading">
                <div class="usda-spinner"></div>
                <p>Searching USDA database...</p>
            </div>
        `;
    }

    // Show message
    function showMessage(message, type) {
        const container = document.getElementById('usda-results-container');
        const color = type === 'error' ? window.USDA_CONFIG.COLORS.error : window.USDA_CONFIG.COLORS.success;
        container.innerHTML = `
            <div class="usda-empty-state">
                <p style="color: ${color}">${message}</p>
            </div>
        `;
    }

    // Wire up search functionality
    function wireUpSearch() {
        const searchBtn = document.getElementById('usda-search-btn');
        const searchInput = document.getElementById('usda-search-input');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch();
            });

            // Search mode change
            document.querySelectorAll('input[name="search-mode"]').forEach(radio => {
                radio.addEventListener('change', updateSearchMode);
            });

            console.log('[USDA Search] Search functionality wired up');
            return true;
        }
        return false;
    }

    // Initialize
    if (!wireUpSearch()) {
        const observer = new MutationObserver(() => {
            if (wireUpSearch()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Export for testing
    try {
        module.exports = { performSearch, displayResults };
    } catch (e) {}

    console.log('[USDA Search] Search module loaded successfully');
})();
