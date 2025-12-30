import os
from dotenv import load_dotenv
load_dotenv()

from backend.chat.language import detect_language
from backend.chat.translate import translate_text
from backend.chat.rag import answer_question   # existing RAG
from backend.chat.query_normalizer import normalize_question


def answer_question_multilingual(user_question: str) -> str:
    """
    Multilingual wrapper:
    - Detects user language
    - Translates question to English (if needed)
    - Normalizes English question to dataset-style
    - Calls existing English RAG
    - Translates final answer back to user language
    """

    # Step 1: Detect language
    user_language = detect_language(user_question)

    # Step 2: Translate question to English if needed
    if user_language != "en":
        question_en = translate_text(user_question, "en")
    else:
        question_en = user_question

    # 🔹 STEP 2.5: Normalize English question (IMPORTANT FIX)
    question_en = normalize_question(question_en)

    # Step 3: Call existing RAG (English only)
    answer_en = answer_question(question_en)

    # Step 4: Translate answer back to user language
    if user_language != "en":
        final_answer = translate_text(answer_en, user_language)
    else:
        final_answer = answer_en

    return final_answer
