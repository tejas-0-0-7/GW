# AI Misinformation Detector 🔍

## Overview

The AI Misinformation Detector is a powerful tool designed to help users identify and analyze potential misinformation in online content. By combining Chrome extension accessibility with advanced AI analysis, it provides real-time credibility assessment of any text content you encounter online.

![Extension Demo](Assets/demo.gif)

## Why Use This Tool?

In today's digital age, misinformation spreads rapidly. This tool helps you:
- Quickly verify the credibility of online content
- Identify potential biases in articles
- Understand the sentiment and tone of content
- Access fact-checking resources for claims
- Make informed decisions about the information you consume

## Core Features

### Instant Analysis
- Select any text on a webpage and analyze it instantly
- Paste entire articles for comprehensive analysis
- Get real-time credibility scores and explanations

### Smart Detection
- Credibility scoring (0-100%)
- Sentiment analysis with confidence levels
- Technical content verification
- Scientific claim validation
- Source credibility assessment

### User-Friendly Interface
- Clean, modern design
- Color-coded results for easy understanding
- Detailed explanations of analysis
- One-click access via Chrome extension

## Getting Started

### Prerequisites
- Chrome Browser (Version 88 or higher)
- Python 3.8+
- pip (Python package manager)

### Quick Installation

1. **Backend Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/ai-misinformation-detector.git
   cd ai-misinformation-detector

   # Set up Python virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Start the server
   uvicorn app.main:app --reload
   ```

2. **Extension Setup**
   - Open Chrome
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `Extension` folder from the project

## How to Use

### Method 1: Chrome Extension
1. Select text on any webpage
2. Click the extension icon or right-click
3. View instant analysis results

### Method 2: Web Interface
1. Visit `http://localhost:8000`
2. Enter text or URL
3. Get comprehensive analysis

## Analysis Results Explained

### Credibility Score
- 80-100%: Highly credible content
- 60-79%: Generally reliable content
- 40-59%: Mixed credibility
- Below 40%: Potentially unreliable

### What You Get
- Overall credibility assessment
- Sentiment analysis
- Technical content detection
- Fact-checking results
- Detailed explanations
- Source verification

## Technical Architecture

### Backend (FastAPI)
- Advanced NLP processing
- Sentiment analysis models
- Fact-checking algorithms
- RESTful API endpoints

### Frontend (Chrome Extension)
- Real-time text selection
- Context menu integration
- Modern UI components
- Instant results display

## Privacy & Security
- No data storage
- Local processing
- No login required
- Open-source code

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

Need help? Here's how to get support:
- Open an issue on GitHub
- Email: support@misinformation-detector.com
- Documentation: [Wiki](https://github.com/yourusername/ai-misinformation-detector/wiki)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- FastAPI for the backend framework
- Chrome Extensions API
- Natural Language Processing libraries
- Open-source AI models

---

Made with ❤️ by [Your Team Name] 