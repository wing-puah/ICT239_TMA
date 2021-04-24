from Flask import request
import json

from app import app


@app.route('/login', methods=['POST'])
def login():
    if request.method == "POST":
        data = request.json
        print(data)
        # return jsons.


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.json
        print(data)
        username = data.get('username')
        password = data.get('password')
        weight = data.get('weight')
        gener = data.get('gender')
