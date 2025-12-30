# USDA Nutrition App - Modular Architecture Summary

## 🎉 Project Complete!

This document summarizes the modular architecture implementation of the USDA Nutrition Lookup Tampermonkey script.

## 📁 Project Structure

```
USDA_Nutrition_App/
├── usda-nutrition-lookup.user.js              # Original monolithic script (incomplete)
├── usda-nutrition-lookup-modular.user.js      # NEW: Modular main script
├── JS/                                         # Module directory
│   ├── Core.js                                # Configuration and utilities
│   ├── UI.js                                  # Main interface components
│   ├── Search.js                              # Search functionality
│   ├── Settings.js                            # Settings modal
│   ├── Dragging.js                            # Panel dragging
│   └── DetailView.js                          # Detailed food information
├── README.md                                   # User documentation
└── multi-tampermonkey-guide.md                # Architecture guide

```

## 🏗️ Module Architecture

### 1. Core.js - Foundation Module
**Purpose**: Provides shared configuration, state, and utility functions

**Exports**:
- `window.USDA_CONFIG` - Color palette, API settings, nutrient lists
- `window.USDA_STATE` - Shared state (visibility, dragging, results)
- `window.USDA_UTILS` - Helper functions for storage, API requests, nutrient formatting

**Key Features**:
- Centralized configuration management
- API request wrapper with rate limiting
- Storage helpers for API key and preferences
- Nutrient extraction and formatting utilities

### 2. UI.js - Interface Module
**Purpose**: Creates and manages the main user interface

**Features**:
- Floating toggle button (bottom-right)
- Main panel with header and content area
- Search mode selector (Text/FDC ID/NDB Number)
- Search input and button
- Data type filters (Branded/Foundation/Survey)
- Results container
- Comprehensive CSS styling

**Events**:
- Dispatches `usda:openSettings` when settings button clicked
- Listens for toggle button clicks

### 3. Search.js - Search Module
**Purpose**: Handles all search functionality and result display

**Features**:
- Text search with data type filtering
- FDC ID lookup
- NDB Number search
- Dynamic result card generation
- Customizable nutrient display (uses user preferences)
- Loading states and error handling

**Events**:
- Dispatches `usda:showDetail` when result card clicked
- Updates search input placeholder based on mode

### 4. Settings.js - Configuration Module
**Purpose**: Manages settings modal and user preferences

**Features**:
- API key input and storage
- API connection testing
- Request counter with visual progress bar
- Nutrient preference selection (up to 6)
- Reset counter functionality
- Auto-opens if no API key set

**Events**:
- Listens for `usda:openSettings` event
- Listens for `usda:requestCountUpdated` event
- Updates usage display in real-time

### 5. Dragging.js - Interaction Module
**Purpose**: Makes the panel draggable

**Features**:
- Drag from header to reposition panel
- Keeps panel within viewport bounds
- Smooth dragging with visual feedback
- Automatic cleanup on mouse release

**Implementation**:
- Uses mousedown/mousemove/mouseup events
- Updates panel position with CSS transforms
- Prevents text selection during drag

### 6. DetailView.js - Detail Module
**Purpose**: Shows comprehensive food information in a modal

**Features**:
- Food metadata (Type, FDC ID, Brand, NDB Number)
- Key nutrients grid (Calories, Protein, Carbs, Fat)
- Complete nutrients table with all available data
- Improved color scheme with Whole Foods green header
- Hover effects on table rows
- External link to USDA website

**Events**:
- Listens for `usda:showDetail` event
- Closes on outside click or X button

**Styling Improvements**:
- Green header for consistency
- White background for table
- Hover effects for better UX
- Sticky header for long nutrient lists

## 🔄 Module Communication

The modules communicate through:

1. **Global Objects**:
   - `window.USDA_CONFIG` - Shared configuration
   - `window.USDA_STATE` - Shared state
   - `window.USDA_UTILS` - Shared utilities

2. **Custom Events**:
   - `usda:openSettings` - Open settings modal
   - `usda:showDetail` - Show food details
   - `usda:requestCountUpdated` - Update usage display

3. **DOM Elements**:
   - Modules wait for elements to exist using MutationObserver
   - Event listeners attached to shared elements

## 🚀 Installation

### For Development (Local Testing)
1. Install Tampermonkey
2. Create new script
3. Copy content from `usda-nutrition-lookup-modular.user.js`
4. Change `@require` URLs to local file paths:
   ```javascript
   // @require file:///C:/path/to/USDA_Nutrition_App/JS/Core.js
   // @require file:///C:/path/to/USDA_Nutrition_App/JS/UI.js
   // etc...
   ```

### For Production (GitHub)
1. Push all files to GitHub repository
2. Install from: `https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/usda-nutrition-lookup-modular.user.js`
3. Tampermonkey will automatically load modules from GitHub

## ✨ Features Implemented

### Core Features
- ✅ Whole Foods themed UI (green #00754a, orange #f47920)
- ✅ 🍗 Chicken emoji logo
- ✅ Draggable panel
- ✅ Multiple search modes (Text, FDC ID, NDB Number)
- ✅ Data type filtering
- ✅ Customizable nutrient display (up to 6)

### API Integration
- ✅ USDA FoodData Central API
- ✅ Rate limiting (1000 requests/hour)
- ✅ Request counter with visual progress
- ✅ API key management
- ✅ Connection testing

### User Experience
- ✅ Detailed food information modal
- ✅ Click results to view full details
- ✅ Hover effects and animations
- ✅ Loading states
- ✅ Error handling
- ✅ Keyboard shortcut (Ctrl+Shift+U)

### Architecture
- ✅ Modular design following best practices
- ✅ Event-driven communication
- ✅ Separation of concerns
- ✅ Easy to maintain and extend
- ✅ Auto-updates from GitHub

## 🎨 Color Scheme

```javascript
{
    primary: '#00754a',      // Whole Foods Green
    primaryDark: '#005a3a',  // Darker green for hover
    secondary: '#f47920',    // Whole Foods Orange
    background: '#ffffff',   // White
    text: '#333333',         // Dark gray
    textLight: '#666666',    // Light gray
    border: '#e0e0e0',       // Light border
    hover: '#e8f5e9',        // Light green hover
    error: '#d32f2f',        // Red
    success: '#2e7d32'       // Green
}
```

## 📊 Module Dependencies

```
Main Script (usda-nutrition-lookup-modular.user.js)
    ↓
    ├── Core.js (no dependencies)
    ├── UI.js (depends on Core.js)
    ├── Search.js (depends on Core.js, UI.js)
    ├── Settings.js (depends on Core.js)
    ├── Dragging.js (depends on Core.js, UI.js)
    └── DetailView.js (depends on Core.js)
```

## 🔧 Extending the App

### Adding a New Module

1. Create new file in `JS/` directory
2. Wrap in IIFE: `(function() { 'use strict'; ... })();`
3. Use `window.USDA_CONFIG`, `window.USDA_STATE`, `window.USDA_UTILS`
4. Add to main script's `@require` list
5. Use MutationObserver if waiting for DOM elements
6. Communicate via custom events

### Example New Module

```javascript
// JS/MyNewFeature.js
(function() {
    'use strict';
    
    console.log('[USDA MyFeature] Loading...');
    
    function myFunction() {
        // Use shared utilities
        const apiKey = window.USDA_UTILS.getApiKey();
        // Your code here
    }
    
    // Listen for events
    document.addEventListener('usda:someEvent', myFunction);
    
    console.log('[USDA MyFeature] Loaded successfully');
})();
```

## 📝 Version History

### v2.0.0 (Current)
- ✨ Complete modular refactor
- ✨ Draggable panel
- ✨ Detailed food view modal
- ✨ Customizable nutrient display
- ✨ Improved color scheme
- ✨ Multiple search modes
- ✨ Request tracking

### v1.1.0
- Added FDC ID and NDB Number search
- Added rate limiting
- Added request counter

### v1.0.0
- Initial release
- Basic text search
- Settings modal
- API key management

## 🎯 Future Enhancements

Potential additions:
- Export results to CSV
- Save favorite foods
- Meal planning features
- Nutrition goals tracking
- Dark mode toggle
- Multiple language support
- Offline caching
- Comparison view (compare 2+ foods)

## 📚 Resources

- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide.html)
- [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php)
- [Multi-File Architecture Guide](./multi-tampermonkey-guide.md)

## 🙏 Credits

- **Author**: RynAgain
- **API**: USDA FoodData Central
- **Design Inspiration**: Whole Foods Market
- **Architecture Pattern**: CAM_Tools project

---

**Made with ❤️ and 🍗**
