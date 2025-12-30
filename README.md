# USDA Nutrition Lookup - Whole Foods Theme

A beautiful Tampermonkey userscript that provides a Whole Foods-themed interface for querying the USDA FoodData Central API. Search for nutritional information on thousands of food items with an elegant, easy-to-use interface.

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- 🎨 **Whole Foods Themed UI** - Clean, professional design inspired by Whole Foods Market
- 🔍 **Powerful Search** - Search across branded foods, foundation foods, and survey foods
- 🔐 **Secure API Key Storage** - Your API key is stored locally using Tampermonkey's secure storage
- 📊 **Nutritional Information** - View calories, protein, carbs, fat, and more
- 🚀 **Fast & Lightweight** - Minimal performance impact on your browsing
- 🔄 **Auto-Updates** - Automatically receives updates from GitHub
- 🌐 **Works Everywhere** - Available on any website with a floating button

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
1. Click here to install: [usda-nutrition-lookup.user.js](https://raw.githubusercontent.com/RynAgain/USDA_Nutrition_App/main/usda-nutrition-lookup.user.js)
2. Tampermonkey will open and show the script
3. Click "Install"

**Option 2: Manual Install**
1. Open Tampermonkey dashboard in your browser
2. Click the "+" icon to create a new script
3. Copy the contents of [`usda-nutrition-lookup.user.js`](./usda-nutrition-lookup.user.js)
4. Paste into the editor
5. Click File → Save (or Ctrl+S / Cmd+S)

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

1. Click the green floating button to open the panel
2. Enter a food name in the search bar (e.g., "apple", "chicken breast", "milk")
3. Select which food types to search:
   - **Branded Foods**: Commercial products with brand names
   - **Foundation Foods**: Minimally processed foods with detailed nutrient data
   - **Survey Foods**: Foods from USDA dietary surveys
4. Click "Search" or press Enter
5. Browse the results with nutritional information
6. Click any result card to view complete details on the USDA website

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
- Supports filtering by data type (Branded, Foundation, Survey)
- Returns up to 25 results per search

## Features in Detail

### Whole Foods Theme
- Professional green color scheme (#00754a)
- Clean, modern interface design
- Smooth animations and transitions
- Responsive layout

### Search Capabilities
- Real-time search with instant results
- Filter by multiple food data types
- View key nutrients at a glance
- Direct links to full USDA data

### Security & Privacy
- API key stored locally in your browser
- No data sent to third parties
- All requests go directly to USDA API
- Open source code for transparency

### User Experience
- Non-intrusive floating button
- Collapsible panel design
- Works on any website
- Keyboard shortcuts (Enter to search)
- Loading indicators
- Error handling with helpful messages

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

### Version 1.0.0 (2025-12-30)
- Initial release
- Whole Foods themed UI
- USDA FoodData Central API integration
- Search functionality with filters
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
