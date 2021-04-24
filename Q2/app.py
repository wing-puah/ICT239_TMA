from flask import Flask, render_template

# For flask implementation
from flask import Flask, render_template, request, redirect, url_for
from bson import ObjectId  # For ObjectId to work
from flask_pymongo import PyMongo
import os


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


@app.route("/register")
def register():
    return render_template("register.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/upload")
def upload():
    return render_template("upload.html")


if __name__ == "__main__":
    app.run(debug=True)
