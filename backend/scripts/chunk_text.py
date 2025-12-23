import os

CHUNK_SIZE = 400     # words
OVERLAP = 50         # words

def chunk_text(text):
    words = text.split()
    chunks = []

    start = 0
    while start < len(words):
        end = start + CHUNK_SIZE
        chunk_words = words[start:end]
        chunk = " ".join(chunk_words)
        chunks.append(chunk)
        start = end - OVERLAP

    return chunks
