// DetailView Module - Shows detailed food information
(function() {
    'use strict';

    console.log('[USDA DetailView] Loading detail view module');

    const COLORS = window.USDA_CONFIG.COLORS;

    // Inject detail modal styles
    function injectStyles() {
        if (document.getElementById('usda-detail-styles')) return;

        const style = document.createElement('style');
        style.id = 'usda-detail-styles';
        style.textContent = `
            #usda-detail-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000001;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .usda-detail-content {
                max-width: 700px;
            }

            #usda-close-detail {
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
                font-size: 12px;
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

            .usda-nutrient-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 12px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
            }

            .usda-nutrient-table th,
            .usda-nutrient-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid ${COLORS.border};
            }

            .usda-nutrient-table th {
                background: ${COLORS.primary};
                font-weight: 600;
                color: white;
                position: sticky;
                top: 0;
            }

            .usda-nutrient-table tbody tr:hover {
                background: ${COLORS.hover};
            }

            .usda-nutrient-table td {
                color: ${COLORS.text};
            }

            .usda-nutrient-table td:last-child {
                text-align: right;
                font-weight: 600;
                color: ${COLORS.primary};
            }

            .usda-nutrient-table tbody tr:last-child td {
                border-bottom: none;
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
    }

    // Create detail modal
    function createDetailModal() {
        if (document.getElementById('usda-detail-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'usda-detail-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="usda-modal-content usda-detail-content">
                <div class="usda-modal-header">
                    <h3 id="usda-detail-title">Food Details</h3>
                    <button id="usda-close-detail">&times;</button>
                </div>
                <div class="usda-modal-body" id="usda-detail-body">
                    <!-- Details will be populated here -->
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Wire up events
        document.getElementById('usda-close-detail').addEventListener('click', closeDetailModal);
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'usda-detail-modal') closeDetailModal();
        });

        console.log('[USDA DetailView] Detail modal created');
    }

    // Show detail modal
    function showDetailModal(food) {
        const modal = document.getElementById('usda-detail-modal');
        const titleEl = document.getElementById('usda-detail-title');
        const bodyEl = document.getElementById('usda-detail-body');

        if (!modal || !titleEl || !bodyEl) return;

        titleEl.textContent = food.description || 'Food Details';
        bodyEl.innerHTML = createDetailContent(food);

        modal.style.display = 'flex';
    }

    // Close detail modal
    function closeDetailModal() {
        const modal = document.getElementById('usda-detail-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Create detail content
    function createDetailContent(food) {
        const nutrients = food.foodNutrients || [];
        
        // Get key nutrients for the summary grid
        const energy = window.USDA_UTILS.getNutrient(nutrients, 'energy');
        const protein = window.USDA_UTILS.getNutrient(nutrients, 'protein');
        const carbs = window.USDA_UTILS.getNutrient(nutrients, 'carbohydrate');
        const fat = window.USDA_UTILS.getNutrient(nutrients, 'total lipid');

        // Build metadata section
        let metadata = `
            <div class="usda-detail-section">
                <h4>Food Information</h4>
                <div class="usda-detail-grid">
                    <div class="usda-detail-item">
                        <strong>Data Type</strong>
                        <span>${food.dataType || 'Unknown'}</span>
                    </div>
                    <div class="usda-detail-item">
                        <strong>FDC ID</strong>
                        <span>${food.fdcId || 'N/A'}</span>
                    </div>
        `;

        if (food.brandOwner) {
            metadata += `
                    <div class="usda-detail-item">
                        <strong>Brand</strong>
                        <span>${food.brandOwner}</span>
                    </div>
            `;
        }

        if (food.ndbNumber) {
            metadata += `
                    <div class="usda-detail-item">
                        <strong>NDB Number</strong>
                        <span>${food.ndbNumber}</span>
                    </div>
            `;
        }

        metadata += `
                </div>
            </div>
        `;

        // Build key nutrients section
        const keyNutrients = `
            <div class="usda-detail-section">
                <h4>Key Nutrients</h4>
                <div class="usda-detail-grid">
                    <div class="usda-detail-item">
                        <strong>Calories</strong>
                        <span>${energy}</span>
                    </div>
                    <div class="usda-detail-item">
                        <strong>Protein</strong>
                        <span>${protein}</span>
                    </div>
                    <div class="usda-detail-item">
                        <strong>Carbohydrates</strong>
                        <span>${carbs}</span>
                    </div>
                    <div class="usda-detail-item">
                        <strong>Fat</strong>
                        <span>${fat}</span>
                    </div>
                </div>
            </div>
        `;

        // Build full nutrients table
        let nutrientsTable = '';
        if (nutrients.length > 0) {
            const rows = nutrients
                .filter(n => n.nutrientName && n.value !== undefined)
                .map(n => `
                    <tr>
                        <td>${n.nutrientName}</td>
                        <td>${n.value.toFixed(2)} ${n.unitName || ''}</td>
                    </tr>
                `)
                .join('');

            nutrientsTable = `
                <div class="usda-detail-section">
                    <h4>All Nutrients</h4>
                    <table class="usda-nutrient-table">
                        <thead>
                            <tr>
                                <th>Nutrient</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // Build external link
        const externalLink = food.fdcId ? `
            <div class="usda-detail-section">
                <a href="https://fdc.nal.usda.gov/fdc-app.html#/food-details/${food.fdcId}/nutrients" 
                   target="_blank" 
                   class="usda-external-link">
                    View on USDA Website →
                </a>
            </div>
        ` : '';

        return metadata + keyNutrients + nutrientsTable + externalLink;
    }

    // Listen for show detail event
    document.addEventListener('usda:showDetail', (e) => {
        showDetailModal(e.detail);
    });

    // Initialize
    function init() {
        injectStyles();
        createDetailModal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for testing
    try {
        module.exports = { showDetailModal, closeDetailModal };
    } catch (e) {}

    console.log('[USDA DetailView] Detail view module loaded successfully');
})();
