from flask import Flask, Response, render_template, jsonify

# For flask implementation
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.exceptions import HTTPException, InternalServerError
from bson import ObjectId  # For ObjectId to work
from flask_pymongo import PyMongo
import json
import os
import copy

from models import User
# from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://127.0.0.1:27017/fitwell'
mongo = PyMongo(app)
user_db_handler = User(mongo.db.user)


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
        # return redirect('/log')
        # return redirect(url_for('log'))
        return json.dumps({'success': True, 'data': db_res})


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
        print(f'A user is logging in: {data}')
        db_res = user_db_handler.get_single(data['email'], data['password'])

        if db_res == None:
            return Response('Unauthenticated', status=401)

        return json.dumps({'success': True, 'data': db_res})
        # return redirect(url_for('log'))


if __name__ == "__main__":
    app.run(debug=True)
