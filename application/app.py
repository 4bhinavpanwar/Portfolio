from flask import Flask, request, jsonify, make_response, render_template
from flask_cors import CORS
import uuid
from datetime import datetime
import threading
import time
import os

app = Flask(__name__, template_folder='templates')

# Configure CORS with proper settings
CORS(app, 
     resources={
         r"/api/*": {
             "origins": ["https://abhinavpanwar.netlify.app/"],
             "supports_credentials": True,
             "allow_headers": ["Content-Type"],
             "methods": ["GET", "POST", "OPTIONS"]
         }
     })

# For session security
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_HTTPONLY=True
)

# Dictionary to store active sessions {device_id: last_active_time}
active_sessions = {}
lock = threading.Lock()
SESSION_TIMEOUT = 30 * 60  # 30 minutes in seconds

def cleanup_sessions():
    """Periodically remove inactive sessions"""
    while True:
        time.sleep(60)  # Run every minute
        now = datetime.now()
        with lock:
            expired = [k for k, v in active_sessions.items() 
                      if (now - v).total_seconds() > SESSION_TIMEOUT]
            for device_id in expired:
                del active_sessions[device_id]

# Start cleanup thread
cleanup_thread = threading.Thread(target=cleanup_sessions, daemon=True)
cleanup_thread.start()

@app.route('/')
def home():
    """Serve the black background template"""
    return render_template('index.html', server_time=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

@app.route('/api/active_users', methods=['GET', 'OPTIONS'])
def handle_active_users():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response
    
    # Handle actual GET request
    device_id = request.cookies.get('device_id')
    
    if not device_id:
        device_id = str(uuid.uuid4())
    
    with lock:
        active_sessions[device_id] = datetime.now()
    
    response = make_response(jsonify({
        'active_users': len(active_sessions),
        'your_device_id': device_id
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
    
    # Set CORS headers
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@app.route('/api/healthcheck', methods=['GET'])
def healthcheck():
    return jsonify({
        "status": "healthy",
        "active_users": len(active_sessions),
        "server_time": datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Use environment variable for port or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)