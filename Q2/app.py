from flask import Flask, render_template

# For flask implementation
from flask import Flask, render_template, request, redirect, url_for
from bson import ObjectId  # For ObjectId to work
from flask_pymongo import PyMongo
import json
import os
import copy


# from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://127.0.0.1:27017/fitwell'
mongo = PyMongo(app)


@app.route("/")
def index():
    cursor = mongo.db.user.find()
    record_count = str(cursor.count())
    print(f'record_count: {record_count}')
    return render_template("index.html")


@app.route("/log")
def log():
    return render_template("log.html")


@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template("register.html")
    elif request.method == 'POST':
        data = request.json
        return save_user_to_db(data)


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/upload")
def upload():
    return render_template("upload.html")


@app.route('/login', methods=['POST'])
def login():
    if request.method == "POST":
        data = request.json
        print(data)
        # return jsons.


def save_user_to_db(data):
    print(data)
    clone_data = copy.deepcopy(data)
    del clone_data['password']
    # username = data.get('email')
    # password = data.get('password')
    # weight = data.get('weight')
    # gender = data.get('gender')
    return json.dumps({'success': True, 'data': clone_data})


if __name__ == "__main__":
    app.run(debug=True)
