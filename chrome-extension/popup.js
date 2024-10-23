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
          .then(response => response.json())
          .then(data => {
            if (data.response) {
              addMessageToChat('ai', data.response);
            } else {
              throw new Error('Invalid response from server');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred while processing your request.';
          });
        });
      });
    }
  }

  function addMessageToChat(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = text;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
});
