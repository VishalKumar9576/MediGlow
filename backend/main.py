from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from chatbot import get_bot_response

app = FastAPI()

# CORS (IMPORTANT for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"status": "Chatbot running"}


@app.post("/chat")
def chat(req: ChatRequest):
    reply = get_bot_response(req.message)
    return {"reply": reply}
    
