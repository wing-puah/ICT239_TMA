from flask import Flask, Response, render_template, jsonify

# For flask implementation
from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.exceptions import HTTPException, InternalServerError
from bson import ObjectId  # For ObjectId to work
from flask_pymongo import PyMongo
import json
import os
import copy

from models import User, Activity, File, FileMapper
app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://127.0.0.1:27017/fitwell'
mongo = PyMongo(app)

user_db_handler = User(mongo.db.user)
activity_db_handler = Activity(mongo.db.activity)
file_db_handler = File(mongo.db.activity)
file_mapper_db_handler = FileMapper(mongo.db.file_mapper)


@app.route("/")
def index():
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
        print(f'A user is being registerd: {data}')
        db_res = user_db_handler.add_single(data)
        return json.dumps({'success': True, 'data': db_res})


"""
since it is requested that we don't store the user in the backend, 
so for this we just hard code the user as admin@fitwell.com 
"""


@app.route("/dashboard")
def dashboard():
    data = activity_db_handler.get_multi('admin@fitwell.com')
    return render_template("dashboard.html", data=data)


@ app.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == 'GET':
        return render_template("upload.html")
    elif request.method == 'POST':
        if 'file' not in request.files:
            return Response('Missing files', status=406)

        file = request.files['file']
        db_res = file_db_handler.upload(file)
        file_mapper_db_handler.create_and_save_map(db_res)

        return json.dumps({'success': True, })


@ app.route('/login', methods=['POST'])
def login():
    if request.method == "POST":
        data = request.json
        db_res = user_db_handler.get_single(data['email'], data['password'])

        if db_res == None:
            return Response('Unauthenticated', status=401)

        return json.dumps({'success': True, 'data': db_res})


@ app.route('/activity', methods=['POST'])
def activity():
    if request.method == "POST":
        data = request.json
        db_res = activity_db_handler.add_single(data)
        return json.dumps({'success': True, 'data': db_res})


if __name__ == "__main__":
    app.run(debug=True)
