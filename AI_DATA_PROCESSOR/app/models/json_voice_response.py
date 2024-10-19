class JsonVoiceResponse:
    def __init__(self, question: str, answer: str):
        self.question = question
        self.answer = answer
    
    def to_dict(self):
        return {
            'question': self.question,
            'answer': self.answer
        }