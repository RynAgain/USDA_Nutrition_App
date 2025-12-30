# USDA Nutrition Lookup - Whole Foods Theme

A beautiful Tampermonkey userscript that provides a Whole Foods-themed interface for querying the USDA FoodData Central API. Search for nutritional information on thousands of food items with an elegant, easy-to-use interface.

![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Architecture](https://img.shields.io/badge/architecture-modular-blue.svg)

## Features

### Core Features
- 🎨 **Whole Foods Themed UI** - Clean, professional design with green (#00754a) color scheme
- 🍗 **Chicken Emoji Logo** - Fun and recognizable branding
- 🖱️ **Draggable Panel** - Drag from header to reposition anywhere on screen
- 🔍 **Multiple Search Modes** - Text search, FDC ID lookup, or NDB Number search
- 🎯 **Data Type Filtering** - Filter by Branded, Foundation, or Survey foods
- ⚙️ **Customizable Display** - Choose up to 6 nutrients to show in results
- 📊 **Detailed View** - Click any result to see comprehensive nutrition data

### API Integration
- 🔐 **Secure API Key Storage** - Stored locally using Tampermonkey's secure storage
- 📈 **Rate Limiting** - Tracks 1000 requests/hour with visual progress bar
- 🔄 **Auto-Updates** - Automatically receives updates from GitHub
- ✅ **Connection Testing** - Test your API key before using

### User Experience
- 🚀 **Fast & Lightweight** - Minimal performance impact on your browsing
- 🌐 **Works Everywhere** - Available on any website with a floating button
- ⌨️ **Keyboard Shortcut** - Press Ctrl+Shift+U to toggle panel
- 🎭 **Smooth Animations** - Polished hover effects and transitions
- 📱 **Responsive Design** - Works on different screen sizes

## Screenshots

The script adds a floating green button in the bottom-right corner of any webpage. Click it to open the nutrition lookup panel with:
- Search bar with food type filters
- Beautiful result cards with nutritional data
- Settings panel for API key management
- Direct links to detailed USDA food information

## Installation

### Prerequisites

1. **Browser Extension**: Install [Tampermonkey](https://www.tampermonkey.net/) for your browser:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
   - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)
   - [Opera](https://addons.opera.com/en/extensions/details/tampermonkey-beta/)

2. **USDA API Key**: Get a free API key from [USDA FoodData Central](https://fdc.nal.usda.gov/api-key-signup.html)
   - Visit the link above
   - Fill out the simple form
   - You'll receive your API key instantly via email

### Install the Script

**Option 1: Direct Install (Recommended)**
1. Click here to install: [usda-nutrition-lookup-modular.user.js](https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/usda-nutrition-lookup-modular.user.js)
2. Tampermonkey will open and show the script
3. Click "Install"
4. The script will automatically load all required modules from GitHub

**Option 2: Manual Install**
1. Open Tampermonkey dashboard in your browser
2. Click the "+" icon to create a new script
3. Copy the contents of [`usda-nutrition-lookup-modular.user.js`](./usda-nutrition-lookup-modular.user.js)
4. Paste into the editor
5. Click File → Save (or Ctrl+S / Cmd+S)

**Note**: The modular version automatically loads 6 separate modules:
- Core.js - Configuration and utilities
- UI.js - Interface components
- Search.js - Search functionality
- Settings.js - Settings modal
- Dragging.js - Panel dragging
- DetailView.js - Detailed food information

## Setup & Usage

### First Time Setup

1. After installation, visit any website
2. You'll see a green circular button in the bottom-right corner
3. Click the button to open the panel
4. The settings modal will automatically open on first use
5. Enter your USDA API key
6. Click "Test API Connection" to verify it works
7. Click "Save Settings"

### Searching for Foods

1. Click the green floating button (bottom-right) to open the panel
2. Choose your search mode:
   - **Text Search**: Search by food name (e.g., "apple", "chicken breast")
   - **FDC ID**: Look up by FoodData Central ID (e.g., "534358")
   - **NDB Number**: Look up by National Database Number (e.g., "09003")
3. For text search, select which food types to include:
   - **Branded Foods**: Commercial products with brand names
   - **Foundation Foods**: Minimally processed foods with detailed nutrient data
   - **Survey Foods**: Foods from USDA dietary surveys
4. Enter your search term and click "Search" or press Enter
5. Browse the results with customizable nutritional information
6. **Click any result card** to view comprehensive details in a modal

### Viewing Detailed Information

When you click a food result:
- See complete food metadata (Type, FDC ID, Brand, NDB Number)
- View key nutrients in an easy-to-read grid
- Browse ALL available nutrients in a sortable table
- Click "View on USDA Website" for official documentation

### Customizing Nutrient Display

1. Click the settings gear icon
2. Scroll to "Display Nutrients"
3. Select up to 6 nutrients to show in search results
4. Common options: Energy, Protein, Carbs, Fat, Fiber, Sugars, Vitamins, Minerals
5. Click "Save Settings"
6. Your preferences are saved and used for all future searches

### Managing Settings

1. Click the gear icon (⚙️) in the panel header
2. Update your API key if needed
3. Test the connection to verify
4. Save your changes

## API Information

This script uses the [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide.html), which provides:

- **170,000+ food items** from multiple data sources
- **Detailed nutritional information** including macros, vitamins, and minerals
- **Regular updates** with new foods and data
- **Free API access** with generous rate limits

### API Endpoints Used

- `GET /foods/search` - Search for foods by query string
- `GET /food/{fdcId}` - Get specific food by FDC ID
- Supports filtering by data type (Branded, Foundation, Survey)
- Returns up to 25 results per search
- Rate limited to 1000 requests per hour

## Architecture

### Modular Design

This script uses a modular architecture for better maintainability and extensibility. See [`MODULAR_ARCHITECTURE.md`](./MODULAR_ARCHITECTURE.md) for detailed documentation.

**Module Structure:**
```
Main Script (usda-nutrition-lookup-modular.user.js)
├── Core.js - Configuration, state, utilities
├── UI.js - Main interface components
├── Search.js - Search functionality
├── Settings.js - Settings modal
├── Dragging.js - Panel dragging
└── DetailView.js - Detailed food view
```

**Benefits:**
- ✅ Separation of concerns
- ✅ Easy to maintain and extend
- ✅ Individual modules can be updated
- ✅ Reusable components
- ✅ Better code organization

### Module Communication

Modules communicate through:
- **Global Objects**: `USDA_CONFIG`, `USDA_STATE`, `USDA_UTILS`
- **Custom Events**: `usda:openSettings`, `usda:showDetail`, `usda:requestCountUpdated`
- **DOM Elements**: Shared elements with event listeners

For developers interested in extending the script, see [`multi-tampermonkey-guide.md`](./multi-tampermonkey-guide.md) for patterns and best practices.

## Troubleshooting

### Script Not Appearing
- Ensure Tampermonkey is installed and enabled
- Check that the script is enabled in Tampermonkey dashboard
- Refresh the webpage

### Search Not Working
- Verify your API key is entered correctly
- Use the "Test API Connection" button in settings
- Check your internet connection
- Ensure you selected at least one food type

### No Results Found
- Try different search terms
- Use more general terms (e.g., "apple" instead of "honeycrisp apple")
- Try selecting different food type filters
- Some foods may not be in the database

### API Key Issues
- Get a new key from [USDA FoodData Central](https://fdc.nal.usda.gov/api-key-signup.html)
- Make sure you copied the entire key
- Check for extra spaces before/after the key

## Development

### Project Structure
```
USDA_Nutrition_App/
├── usda-nutrition-lookup.user.js  # Main Tampermonkey script
└── README.md                       # This file
```

### Customization

The script can be customized by editing the color palette at the top of the script:

```javascript
const COLORS = {
    primary: '#00754a',      // Whole Foods Green
    primaryDark: '#005a3a',
    secondary: '#f47920',    // Whole Foods Orange
    // ... more colors
};
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Changelog

### Version 2.0.0 (2025-12-30)
- ✨ **Complete modular refactor** - Separated into 6 focused modules
- ✨ **Draggable panel** - Drag from header to reposition
- ✨ **Detailed food view** - Click results to see comprehensive nutrition data
- ✨ **Multiple search modes** - Text, FDC ID, and NDB Number search
- ✨ **Customizable nutrients** - Choose up to 6 nutrients to display
- ✨ **Improved styling** - Better color scheme for nutrient tables
- ✨ **Keyboard shortcut** - Ctrl+Shift+U to toggle panel
- ✨ **Request tracking** - Visual progress bar for API usage
- 🐛 **Bug fixes** - Improved error handling and edge cases

### Version 1.1.0 (2025-12-30)
- Added FDC ID and NDB Number search modes
- Added API rate limiting (1000 requests/hour)
- Added request counter with visual progress bar
- Improved API connection testing

### Version 1.0.0 (2025-12-30)
- Initial release
- Whole Foods themed UI with 🍗 chicken emoji
- USDA FoodData Central API integration
- Text search functionality with data type filters
- Settings panel with API key management
- Nutritional information display
- Auto-update support

## License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 RynAgain

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Acknowledgments

- [USDA FoodData Central](https://fdc.nal.usda.gov/) for providing the comprehensive food database API
- [Tampermonkey](https://www.tampermonkey.net/) for the excellent userscript manager
- Whole Foods Market for design inspiration

## Support

- **Issues**: [GitHub Issues](https://github.com/RynAgain/USDA_Nutrition_App/issues)
- **API Documentation**: [USDA API Guide](https://fdc.nal.usda.gov/api-guide.html)
- **API Key Signup**: [Get Your Free API Key](https://fdc.nal.usda.gov/api-key-signup.html)

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Whole Foods Market or the USDA. The Whole Foods theme is used for aesthetic purposes only. All nutritional data is provided by the USDA FoodData Central API.

---

Made with ❤️ by [RynAgain](https://github.com/RynAgain)
