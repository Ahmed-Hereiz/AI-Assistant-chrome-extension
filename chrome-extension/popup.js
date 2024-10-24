document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');
  const chatHistory = document.getElementById('chatHistory');
  const errorMessage = document.getElementById('errorMessage');

  if (sendBtn && userInput && chatHistory && errorMessage) {
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  } else {
    console.error('Required elements not found');
  }

  function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
      addMessageToChat('user', message);
      userInput.value = '';

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getPageContent"}, (pageContent) => {
          if (chrome.runtime.lastError) {
            console.error('Error getting page content:', chrome.runtime.lastError);
            errorMessage.textContent = 'Failed to get page content. Please refresh the page and try again.';
            return;
          }

          fetch('http://localhost:8000/chat-hereiz', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question: message,
              page_content: pageContent
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then(data => {
            addMessageToChat('ai', data);
          })
          .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = `An error occurred: ${error.message}. Please try again.`;
            addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.');
          });
        });
      });
    }
  }

  function addMessageToChat(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    
    if (sender === 'ai') {
      try {
        messageElement.innerHTML = marked.parse(text);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        messageElement.textContent = text;
      }
    } else {
      messageElement.textContent = text;
    }
    
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
});
