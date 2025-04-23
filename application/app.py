from flask import Flask, request, jsonify, make_response, render_template
from flask_cors import CORS
import uuid
from datetime import datetime, timedelta
import threading
import time
import os
import sqlite3

app = Flask(__name__, template_folder='templates', static_folder='static')

# CORS Configuration
CORS(app, 
     resources={ 
         r"/api/*": { 
             "origins": [
                 "https://abhinavpanwar.netlify.app",
                 "http://127.0.0.1:5500",
                 "http://localhost:5500"
             ], 
             "supports_credentials": True, 
             "allow_headers": ["Content-Type"], 
             "methods": ["GET", "POST", "OPTIONS", "HEAD"], 
             "expose_headers": ["Content-Type"], 
             "max_age": 600 
         }
     })

app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_HTTPONLY=True,
    PERMANENT_SESSION_LIFETIME=timedelta(minutes=30),
    PREFERRED_URL_SCHEME='https'
)

active_sessions = {}
lock = threading.Lock()
SESSION_TIMEOUT = 15
CLEANUP_INTERVAL = 5

# Database Initialization
def init_db():
    conn = sqlite3.connect('headline.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS headline (
            id INTEGER PRIMARY KEY,
            text TEXT
        )
    ''')
    c.execute('SELECT * FROM headline')
    if not c.fetchone():
        c.execute('INSERT INTO headline (text) VALUES ("")')  # Default empty text
    conn.commit()
    conn.close()

# Cleanup expired sessions
def cleanup_sessions():
    while True:
        time.sleep(CLEANUP_INTERVAL)
        now = datetime.now()
        with lock:
            expired = [
                k for k, v in active_sessions.items() 
                if (now - v['last_active']).total_seconds() > SESSION_TIMEOUT
            ]
            for device_id in expired:
                del active_sessions[device_id]

cleanup_thread = threading.Thread(target=cleanup_sessions, daemon=True)
cleanup_thread.start()

# Home Route
@app.route('/')
def home():
    return render_template('index.html', 
                           server_time=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

# API to end session
@app.route('/api/active_users/end', methods=['POST'])
def end_session():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415

    device_id = request.json.get('device_id')
    with lock:
        active_sessions.pop(device_id, None)
    return jsonify({"status": "session_ended"})

# API to get active users count
@app.route('/api/active_users', methods=['GET', 'OPTIONS'])
def active_users():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    device_id = request.cookies.get('device_id', str(uuid.uuid4()))

    with lock:
        if device_id in active_sessions:
            active_sessions[device_id]['last_active'] = datetime.now()
        else:
            active_sessions[device_id] = {
                'last_active': datetime.now(),
                'created': datetime.now()
            }

    response = make_response(jsonify({
        'active_users': len(active_sessions),
        'your_device_id': device_id,
        'last_active': active_sessions[device_id]['last_active'].isoformat()
    }))

    if not request.cookies.get('device_id'):
        response.set_cookie(
            'device_id',
            value=device_id,
            max_age=365*24*60*60,
            secure=True,
            httponly=True,
            samesite='None',
            path='/'
        )

    return response

# API for health check
@app.route('/api/healthcheck')
def healthcheck():
    with lock:
        active_count = len(active_sessions)
        oldest_session = min(
            [s['created'] for s in active_sessions.values()], 
            default=datetime.now()
        )

    return jsonify({
        "status": "healthy",
        "active_users": active_count,
        "oldest_session": oldest_session.isoformat(),
        "server_time": datetime.now().isoformat(),
        "version": "1.2.1"
    })

# API to get headline text
@app.route('/api/get_h3', methods=['GET'])
def get_h3():
    conn = sqlite3.connect('headline.db')
    c = conn.cursor()
    c.execute('SELECT text FROM headline WHERE id = 1')
    text = c.fetchone()[0]
    conn.close()
    return jsonify({'h3_text': text})

# API to set headline text
@app.route('/api/set_h3', methods=['POST'])
def set_h3():
    data = request.get_json()
    new_text = data.get('new_text', '')
    conn = sqlite3.connect('headline.db')
    c = conn.cursor()
    c.execute('UPDATE headline SET text = ? WHERE id = 1', (new_text,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'updated', 'new_text': new_text})

# Run the server
if __name__ == '__main__':
    init_db()  # Initialize DB
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
