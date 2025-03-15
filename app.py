from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import speech_recognition as sr
from chatbot import chatbot, translate_hindi_to_english, translate_english_to_hindi

app = Flask(__name__)
CORS(app)
r = sr.Recognizer()

# Include all your existing functions here (scrape_article, preprocess_text, etc.)

@app.route("/")
def index():
    return render_template('bot.html')

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_query = data.get("message", "").strip()
        
        if not user_query:
            return jsonify({"response": "Please say or type something."})

        print(f"Original query: {user_query}")
        english_query = translate_hindi_to_english(user_query)
        print(f"English query: {english_query}")
        
        response = chatbot(english_query)
        print(f"English response: {response}")
        
        hindi_response = translate_english_to_hindi(response)
        print(f"Hindi response: {hindi_response}")  # Fixed missing quotation mark
        
        return jsonify({"response": hindi_response})
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({"response": "Sorry, I encountered an error. Please try again."}), 500

@app.route("/mic", methods=["POST"])
def mic():
    try:
        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source, duration=0.5)
            print("Listening...")
            audio = r.listen(source, timeout=5, phrase_time_limit=5)
            
        text = r.recognize_google(audio, language="hi-IN")
        return jsonify({"transcription": text})
    except sr.UnknownValueError:
        return jsonify({"transcription": "Could not understand audio"})
    except sr.RequestError:
        return jsonify({"transcription": "Could not access speech service"})
    except Exception as e:
        print(f"Microphone error: {str(e)}")
        return jsonify({"transcription": "Error processing audio"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)