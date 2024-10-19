from flask import Blueprint, request, jsonify
import spacy
from app.models.json_voice_response import JsonVoiceResponse
from app.services.process_data import process_question

voice_bp = Blueprint('voice', __name__)

nlp = spacy.load("xx_ent_wiki_sm")

@voice_bp.route('/process-voice', methods=['POST'])
def process_voice():
    data = request.json
    text = data.get('text', '')

    doc = nlp(text)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    result = process_question(text)

    response = JsonVoiceResponse(question=text, answer=result)


    return jsonify(response.to_dict())
