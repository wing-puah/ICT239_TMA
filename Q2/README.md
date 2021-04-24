**Start venv**
`source venv/bin/activate`

**Mongodb**
`sudo service mongodb status`

`sudo service mongodb start`

`sudo service mongodb stop`

**To start flask**

(FLASK_ENV=development for autoreloading)

FLASK_APP=app.py FLASK_ENV=development flask run
