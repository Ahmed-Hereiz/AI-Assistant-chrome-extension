# Hereiz AI Assistant Chrome Extension

Hereiz AI Assistant is a Chrome extension that provides an intelligent AI assistant to help users interact with web content. The extension allows users to ask questions about the current webpage and receive AI-generated responses.

## Features

- AI-powered chat interface within the Chrome browser
- Analyzes the content of the current webpage
- Provides intelligent responses to user queries
- Sleek and user-friendly design

## Components

### 1. Chrome Extension

The extension consists of two main files:

- `popup.html`: Defines the user interface for the extension popup.
- `popup.js`: Handles user interactions, sends requests to the backend, and displays responses.

The extension captures the content of the current webpage and sends it along with the user's question to the backend for processing.

### 2. Backend Server

The backend is powered by a FastAPI server (`main.py`) that processes requests from the Chrome extension. It uses a language model to generate responses based on the user's question and the webpage content.

## Setup and Usage

1. Clone the repository and navigate to the project directory.
2. Run the setup script to download and set up the required `customAgents` package:
   ```
   bash ./setup.sh
   ```
3. Install the Chrome extension (instructions for loading unpacked extension).
4. Set up the backend server:
   - Ensure you have Python installed.
   - Install required dependencies:
     ```
     pip install -r requirements.txt
     ```
   - Configure your API key in `config/llm.json`.
5. Run the backend server:
   ```
   python main.py
   ```
6. The extension is now ready to use. Click on the extension icon in Chrome to open the chat interface.

**Note:** The backend server (`main.py`) must be running for the extension to work properly.

## How It Works

1. User opens the extension popup and types a question.
2. The extension captures the content of the current webpage.
3. The question and webpage content are sent to the backend server.
4. The server processes the input using an AI model and generates a response.
5. The response is displayed in the extension popup.

Enjoy using Hereiz AI Assistant for intelligent interactions with your web browsing!
