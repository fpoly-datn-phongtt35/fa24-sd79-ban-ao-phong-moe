from flask import Flask
from app.controllers.product_controller import voice_bp

app = Flask(__name__)

app.register_blueprint(voice_bp)

if __name__ == '__main__':
    app.run(debug=True)