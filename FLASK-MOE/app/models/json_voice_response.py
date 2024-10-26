class JsonVoiceResponse:
    def __init__(self, question, message, data):
        self.question = question
        self.message = message
        self.data = data
    
    def to_dict(self):
        return {
            'question': self.question,
            'message': self.message,
            'data': self.data,
        }