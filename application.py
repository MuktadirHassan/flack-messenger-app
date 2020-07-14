import os

from flask import Flask, render_template, redirect, url_for, request, session, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = 'mysecretkey'
# os.getenv("SECRET_KEY")
socketio = SocketIO(app)



@app.route("/", methods=["GET","POST"])
def index():
    if 'user' in session:
        return redirect(url_for('channels'))
    if request.method == "POST":
        dname = request.form.get('dname',0)
        if dname:
            session['user'] = dname
            return redirect(url_for('channels'))
    return render_template("index.html")

@app.route("/channels",methods=["GET","POST"])
def channels():
    if 'user' in session:
        if request.method == "POST":
            return render_template("channels.html")
        return render_template("channels.html")
    
    
    return redirect(url_for('index'))

@socketio.on("message incoming")
def vote(data):
    message_content = data["message"]
    message_sender = data["sender"]
    message_time = data["currentTime"]
    emit("message outgoing",{"message_content":message_content,"message_sender":message_sender,"message_time":message_time}, broadcast=True)