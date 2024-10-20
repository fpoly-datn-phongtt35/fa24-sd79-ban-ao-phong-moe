from flask import Blueprint, request, jsonify
import spacy
from app.models.json_voice_response import JsonVoiceResponse
from app.services.process_data import process_question

voice_bp = Blueprint('voice', __name__)

nlp = spacy.load("xx_ent_wiki_sm")

@voice_bp.route('/process-voice', methods=['POST'])
def process_voice():
    data = request.json
    text = data.get('your_question', '')
    result = process_question(text)
    return jsonify(result)
