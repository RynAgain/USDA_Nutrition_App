// Dragging Module - Makes the panel draggable
(function() {
    'use strict';

    console.log('[USDA Dragging] Loading dragging module');

    function initializeDragging() {
        const panel = document.getElementById('usda-app-panel');
        const dragHandle = document.getElementById('usda-drag-handle');

        if (!panel || !dragHandle) {
            console.log('[USDA Dragging] Panel or handle not found yet');
            return false;
        }

        dragHandle.addEventListener('mousedown', (e) => {
            window.USDA_STATE.isDragging = true;
            panel.classList.add('dragging');
            
            const rect = panel.getBoundingClientRect();
            window.USDA_STATE.dragOffset.x = e.clientX - rect.left;
            window.USDA_STATE.dragOffset.y = e.clientY - rect.top;
            
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!window.USDA_STATE.isDragging) return;
            
            const panel = document.getElementById('usda-app-panel');
            let newX = e.clientX - window.USDA_STATE.dragOffset.x;
            let newY = e.clientY - window.USDA_STATE.dragOffset.y;
            
            // Keep panel within viewport
            newX = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight));
            
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (window.USDA_STATE.isDragging) {
                window.USDA_STATE.isDragging = false;
                const panel = document.getElementById('usda-app-panel');
                if (panel) {
                    panel.classList.remove('dragging');
                }
            }
        });

        console.log('[USDA Dragging] Dragging initialized');
        return true;
    }

    // Try to initialize, or wait for panel to be created
    if (!initializeDragging()) {
        const observer = new MutationObserver(() => {
            if (initializeDragging()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Export for testing
    try {
        module.exports = { initializeDragging };
    } catch (e) {}

    console.log('[USDA Dragging] Dragging module loaded successfully');
})();
