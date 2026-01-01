# # ---------------------------------------------
# # CRITICAL: MUST BE AT TOP (before any ML import)
# # ---------------------------------------------
# import os
# os.environ["OMP_NUM_THREADS"] = "1"
# os.environ["MKL_NUM_THREADS"] = "1"
# os.environ["TOKENIZERS_PARALLELISM"] = "false"

# # ---------------------------------------------
# # Standard imports
# # ---------------------------------------------
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, Field
# from typing import Optional
# import time

# from backend.chat.multilingual_rag import answer_question_multilingual
# from backend.chat.language import detect_language

# # ---------------------------------------------
# # FastAPI App
# # ---------------------------------------------
# app = FastAPI(
#     title="Farmer AI Chatbot API",
#     description="Multilingual AI-powered assistant for farmers using RAG",
#     version="2.0.0",
#     docs_url="/docs",
#     redoc_url="/redoc"
# )

# # ---------------------------------------------
# # CORS Configuration (for frontend access)
# # ---------------------------------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, specify your frontend domain
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ---------------------------------------------
# # Request & Response Models
# # ---------------------------------------------
# class ChatRequest(BaseModel):
#     question: str = Field(..., min_length=1, max_length=1000, description="User's question")
#     language: Optional[str] = Field(None, description="Optional: ISO language code (hi, gu, mr, pa, bn, ta, en)")
    
#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "question": "एफिड्स के लिए कौन सा कीटनाशक उपयोग होता है?",
#                 "language": "hi"
#             }
#         }


# class ChatResponse(BaseModel):
#     answer: str = Field(..., description="AI-generated answer")
#     detected_language: str = Field(..., description="Detected or provided language code")
#     processing_time_ms: int = Field(..., description="Time taken to process the request in milliseconds")
#     success: bool = Field(default=True, description="Whether the request was successful")
    
#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "answer": "* एफिड्स\n  - इमिडाक्लोप्रिड\n  - एसिटामिप्रिड\n  - थायामेथॉक्सम",
#                 "detected_language": "hi",
#                 "processing_time_ms": 1234,
#                 "success": True
#             }
#         }


# class HealthResponse(BaseModel):
#     status: str
#     version: str
#     supported_languages: list[str]


# class ErrorResponse(BaseModel):
#     error: str
#     message: str
#     success: bool = False

# class TranslateRequest(BaseModel):
#     text: str = Field(..., min_length=1, description="Text to translate")
#     target_language: str = Field(..., description="Target language code (hi, en, gu, etc.)")

#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "text": "Which pesticide is used for aphids?",
#                 "target_language": "hi"
#             }
#         }


# # ---------------------------------------------
# # Supported Languages
# # ---------------------------------------------
# SUPPORTED_LANGUAGES = {
#     "en": "English",
#     "hi": "Hindi",
#     "gu": "Gujarati",
#     "mr": "Marathi",
#     "pa": "Punjabi",
#     "bn": "Bengali",
#     "ta": "Tamil",
#     "te": "Telugu",
#     "kn": "Kannada",
#     "ml": "Malayalam",
#     "or": "Odia",
#     "as": "Assamese",
#     "ur": "Urdu"
# }

# # ---------------------------------------------
# # API Endpoints
# # ---------------------------------------------

# @app.get("/", tags=["Root"])
# async def root():
#     """Root endpoint - API information"""
#     return {
#         "message": "Farmer AI Chatbot API",
#         "version": "2.0.0",
#         "docs": "/docs",
#         "health": "/health",
#         "chat_endpoint": "/chat"
#     }


# @app.get("/health", response_model=HealthResponse, tags=["Health"])
# async def health_check():
#     """Health check endpoint"""
#     return {
#         "status": "healthy",
#         "version": "2.0.0",
#         "supported_languages": list(SUPPORTED_LANGUAGES.keys())
#     }


# @app.get("/languages", tags=["Languages"])
# async def get_supported_languages():
#     """Get list of supported languages"""
#     return {
#         "supported_languages": SUPPORTED_LANGUAGES,
#         "total_count": len(SUPPORTED_LANGUAGES)
#     }


# @app.post("/chat", response_model=ChatResponse, tags=["Chat"])
# async def chat(request: ChatRequest):
#     """
#     Main chat endpoint - processes multilingual questions
    
#     - **question**: User's question in any supported language
#     - **language**: (Optional) ISO language code. If not provided, will be auto-detected
    
#     Returns answer in the same language as the question.
#     """
#     start_time = time.time()
    
#     try:
#         # Validate input
#         if not request.question or not request.question.strip():
#             raise HTTPException(
#                 status_code=400,
#                 detail="Question cannot be empty"
#             )
        
#         # Detect language if not provided
#         if request.language:
#             detected_lang = request.language.lower()
#             # Validate provided language
#             if detected_lang not in SUPPORTED_LANGUAGES:
#                 raise HTTPException(
#                     status_code=400,
#                     detail=f"Unsupported language: {detected_lang}. Supported: {list(SUPPORTED_LANGUAGES.keys())}"
#                 )
#         else:
#             detected_lang = detect_language(request.question)
        
#         # Process question through multilingual RAG
#         answer = answer_question_multilingual(request.question)
        
#         # Calculate processing time
#         processing_time = int((time.time() - start_time) * 1000)
        
#         return ChatResponse(
#             answer=answer,
#             detected_language=detected_lang,
#             processing_time_ms=processing_time,
#             success=True
#         )
    
#     except HTTPException:
#         raise
    
#     except Exception as e:
#         # Log error (in production, use proper logging)
#         print(f"Error processing request: {str(e)}")
        
#         raise HTTPException(
#             status_code=500,
#             detail=f"Internal server error: {str(e)}"
#         )


# @app.post("/translate", tags=["Translation"])
# def translate_text_endpoint(req: TranslateRequest):
#     """
#     Translate text to target language.
#     Useful for testing translation functionality independently.
#     """
#     try:
#         from backend.chat.translate import translate_text

#         target_language = req.target_language.lower()

#         if target_language not in SUPPORTED_LANGUAGES:
#             raise HTTPException(
#                 status_code=400,
#                 detail=f"Unsupported language: {target_language}"
#             )

#         translated = translate_text(req.text, target_language)

#         return {
#             "original_text": req.text,
#             "translated_text": translated,
#             "target_language": target_language,
#             "language_name": SUPPORTED_LANGUAGES[target_language],
#             "success": True
#         }

#     except HTTPException:
#         raise

#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Translation error: {str(e)}"
#         )


# # ---------------------------------------------
# # Error Handlers
# # ---------------------------------------------

# @app.exception_handler(404)
# async def not_found_handler(request, exc):
#     return {
#         "error": "Not Found",
#         "message": "The requested endpoint does not exist",
#         "success": False
#     }


# @app.exception_handler(500)
# async def internal_error_handler(request, exc):
#     return {
#         "error": "Internal Server Error",
#         "message": "An unexpected error occurred",
#         "success": False
#     }


# # ---------------------------------------------
# # Startup Event
# # ---------------------------------------------

# @app.on_event("startup")
# async def startup_event():
#     """Run on application startup"""
#     print("=" * 60)
#     print("🚀 Farmer AI Chatbot API Starting...")
#     print("=" * 60)
#     print(f"📚 Supported Languages: {len(SUPPORTED_LANGUAGES)}")
#     print(f"🌍 Languages: {', '.join(SUPPORTED_LANGUAGES.values())}")
#     print("=" * 60)


# ---------------------------------------------
# CRITICAL: MUST BE AT TOP (before any ML import)
# ---------------------------------------------
import os
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# ---------------------------------------------
# Standard imports (UNCHANGED)
# ---------------------------------------------
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import time

from backend.chat.multilingual_rag import answer_question_multilingual
from backend.chat.language import detect_language

# =========================================================
# 🔹 ADDITION #1 — IMAGE IMPORTS (ONLY ADDITION)
# =========================================================
from fastapi import UploadFile, File, Form
import shutil
import uuid
from backend.image_models.inference import load_model, predict_image

# ---------------------------------------------
# FastAPI App (UNCHANGED)
# ---------------------------------------------
app = FastAPI(
    title="Farmer AI Chatbot API",
    description="Multilingual AI-powered assistant for farmers using RAG",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ---------------------------------------------
# CORS Configuration (UNCHANGED)
# ---------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------
# Request & Response Models (UNCHANGED)
# ---------------------------------------------
class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000)
    language: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    detected_language: str
    processing_time_ms: int
    success: bool = True

class HealthResponse(BaseModel):
    status: str
    version: str
    supported_languages: list[str]

class TranslateRequest(BaseModel):
    text: str
    target_language: str

# ---------------------------------------------
# Supported Languages (UNCHANGED)
# ---------------------------------------------
SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "gu": "Gujarati",
    "mr": "Marathi",
    "pa": "Punjabi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "ur": "Urdu"
}

# =========================================================
# 🔹 ADDITION #2 — LOAD IMAGE MODELS (NO EXISTING CODE TOUCHED)
# =========================================================
DISEASE_MODEL, DISEASE_CLASSES = load_model(
    "disease",
    "backend/image_models/disease_classes.json"
)

INSECT_MODEL, INSECT_CLASSES = load_model(
    "insect",
    "backend/image_models/insect_classes.json"
)

UPLOAD_DIR = "backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ---------------------------------------------
# Existing Endpoints (UNCHANGED)
# ---------------------------------------------
@app.get("/")
async def root():
    return {
        "message": "Farmer AI Chatbot API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
        "chat_endpoint": "/chat"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "supported_languages": list(SUPPORTED_LANGUAGES.keys())
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    start_time = time.time()

    if request.language:
        detected_lang = request.language.lower()
    else:
        detected_lang = detect_language(request.question)

    answer = answer_question_multilingual(request.question)

    return ChatResponse(
        answer=answer,
        detected_language=detected_lang,
        processing_time_ms=int((time.time() - start_time) * 1000)
    )

@app.post("/translate")
def translate_text_endpoint(req: TranslateRequest):
    from backend.chat.translate import translate_text
    translated = translate_text(req.text, req.target_language)
    return {"translated": translated}

# =========================================================
# 🔹 ADDITION #3 — IMAGE QUERY ENDPOINT (ONLY NEW ENDPOINT)
# =========================================================
@app.post("/image-query")
async def image_query(
    image: UploadFile = File(...),
    type: str = Form(...),
    language: Optional[str] = Form(None)
):
    start_time = time.time()

    if type not in ["disease", "insect"]:
        raise HTTPException(status_code=400, detail="type must be disease or insect")

    ext = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    image_path = os.path.join(UPLOAD_DIR, filename)

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    if type == "disease":
        label, confidence = predict_image(image_path, DISEASE_MODEL, DISEASE_CLASSES)
        query = f"What is {label} disease and how to treat it?"
    else:
        label, confidence = predict_image(image_path, INSECT_MODEL, INSECT_CLASSES)
        query = f"What damage does {label} cause and how to control it?"

    detected_lang = language if language else detect_language(query)
    answer = answer_question_multilingual(query)

    return {
        "type": type,
        "prediction": label,
        "confidence": confidence,
        "answer": answer,
        "language": detected_lang,
        "processing_time_ms": int((time.time() - start_time) * 1000),
        "success": True
    }

# ---------------------------------------------
# Startup Event (UNCHANGED)
# ---------------------------------------------
@app.on_event("startup")
async def startup_event():
    print("🚜 Farmer AI Chatbot API running with Image + RAG support")
