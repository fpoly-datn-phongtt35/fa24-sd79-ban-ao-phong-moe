# Author: Nong Hoang Vu || JavaTech
# Facebook:https://facebook.com/NongHoangVu04
# Github: https://github.com/JavaTech04
# Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
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