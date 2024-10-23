chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callLLM") {
    fetch('http://localhost:8000/chat-hereiz', {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: request.input,
        page_content: request.pageContent
      }),
    })
    .then(response => response.json())
    .then(data => {
      sendResponse({ result: data.response });
    })
    .catch(error => {
      console.error('Error calling LLM:', error);
      sendResponse({ error: 'Failed to call LLM' });
    });
    return true;  // Keeps the message channel open for asynchronous response
  }
});
