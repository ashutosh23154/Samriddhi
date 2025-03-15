import google.generativeai as genai
from deep_translator import GoogleTranslator
import json

GOOGLE_API_KEY = "YOUR_GEMINI_API_KEY"  # Replace with your actual API key
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the Gemini model
gemini_model = genai.GenerativeModel('gemini-pro')

def translate_hindi_to_english(text):
    if not any(ord(char) > 127 for char in text):  # If text is already in English
        return text
    translator = GoogleTranslator(source='hi', target='en')
    return translator.translate(text)

def translate_english_to_hindi(text):
    translator = GoogleTranslator(source='en', target='hi')
    return translator.translate(text)

def chatbot(query):
    try:
        # Use the gemini_model instead of the SentenceTransformer model
        response = gemini_model.generate_content(query)
        return response.text
    except Exception as e:
        print(f"Chatbot error: {str(e)}")
        return "I apologize, but I encountered an error. Please try again."

import os
import requests
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import speech_recognition as sr
from io import BytesIO
from gtts import gTTS
from pydub import AudioSegment
from pydub.playback import play

model = SentenceTransformer('all-MiniLM-L6-v2')

r = sr.Recognizer()

article_urls = [
    "https://www.apollohospitals.com/delhi/indraprastha-apollo-hospitals/",
    "https://en.wikipedia.org/wiki/Machine_learning",
    "https://en.wikipedia.org/wiki/Deep_learning"
]

CACHE_FILE = "article_embeddings.json"

def scrape_article(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        paragraphs = soup.find_all('p')
        text = " ".join([p.get_text() for p in paragraphs])
        return text
    except requests.exceptions.RequestException as e:
        print(f"Error scraping {url}: {e}")
        return ""

def preprocess_text(text, chunk_size=500):
    words = text.split()
    chunks = [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]
    return chunks

def generate_article_embeddings(article_urls, cache_file=CACHE_FILE):
    if os.path.exists(cache_file):
        with open(cache_file, "r") as f:
            data = json.load(f)
        return data["articles"], np.array(data["embeddings"])
    
    articles = []
    embeddings = []
    
    for url in article_urls:
        text = scrape_article(url)
        if text:
            chunks = preprocess_text(text)
            for chunk in chunks:
                articles.append(chunk)
                embeddings.append(model.encode(chunk).tolist())
    
    with open(cache_file, "w") as f:
        json.dump({"articles": articles, "embeddings": embeddings}, f)
    
    return articles, np.array(embeddings)

def find_relevant_article(query, articles, embeddings, threshold=0.7):
    query_embedding = model.encode([query])
    similarities = cosine_similarity(query_embedding, embeddings)
    max_index = np.argmax(similarities)
    
    if similarities[0, max_index] > threshold:
        return articles[max_index]
    return None

def mic():
    with sr.Microphone() as source:
        print("Speak something...")
        audio = r.listen(source)

    try:
        text = r.recognize_google(audio, language="hi-IN")
        return text
    except sr.UnknownValueError:
        return "Sorry, could not understand."
    except sr.RequestError:
        return "Could not request results, check internet."
    
def hindi_text_to_speech(text):
    try:
        tts = gTTS(text=text, lang='hi')
        
        audio_bytes = BytesIO()
        tts.write_to_fp(audio_bytes)
        audio_bytes.seek(0)
        
        audio = AudioSegment.from_file(audio_bytes, format="mp3")
        
        play(audio)
        print("Playing the audio...")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Welcome to the Chatbot! Type 'exit' to quit.")
    while True:
        voice = True
        if(voice):
            user_query = mic()
        else:
            user_query = input("You: ")
        print(user_query)
        user_query = translate_hindi_to_english(user_query)
        response = translate_english_to_hindi(chatbot(user_query))
        print(f"Chatbot: {response}")
        if(voice):
            hindi_text_to_speech(response)
