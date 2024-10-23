import json
import uvicorn
from chat_agents import ChatLLM, ChatPrompt, ChatAgent
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


with open('../config/llm.json', 'r') as config_file:
    llm_config = json.load(config_file)

api_key = llm_config['api_key']
model = llm_config['model']

app = FastAPI()


class ChatInput(BaseModel):
    question: str
    page_content: str

@app.post("/chat-hereiz")
async def chat_hereiz(chat_input: ChatInput):
    try:
        print(chat_input.question, chat_input.page_content)
        chat_llm = ChatLLM(api_key=api_key, model=model, temperature=0.7)
        chat_prompt = ChatPrompt()
        chat_agent = ChatAgent(llm=chat_llm, prompt=chat_prompt)

        chat_prompt.construct_prompt({
            "{input}": chat_input.question,
            "{page_content}": chat_input.page_content
        })

        response = chat_agent.loop()
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Example curl command to use this endpoint:
"""
curl -X POST http://localhost:8000/chat-hereiz \
     -H "Content-Type: application/json" \
     -d '{
         "question": "What is the main topic of this page?",
         "page_content": "This is the content of the webpage. It discusses various topics related to artificial intelligence and machine learning."
     }'
"""
