from flask import Flask, request, jsonify, make_response, render_template
from flask_cors import CORS
import uuid
from datetime import datetime
import threading
import time
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

# Configure CORS for Netlify and local development
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
             "methods": ["GET", "POST", "OPTIONS"]
         }
     })

# Security configurations
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_HTTPONLY=True
)

# Active sessions tracking
active_sessions = {}
lock = threading.Lock()
SESSION_TIMEOUT = 30 * 60  # 30 minutes

def cleanup_sessions():
    """Clean up inactive sessions every minute"""
    while True:
        time.sleep(60)
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
    """Serve the black background page"""
    return render_template('index.html', 
                         server_time=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

@app.route('/api/active_users', methods=['GET', 'OPTIONS'])
def active_users():
    """Handle active users tracking"""
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response
    
    device_id = request.cookies.get('device_id', str(uuid.uuid4()))
    
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
    
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@app.route('/api/healthcheck')
def healthcheck():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "active_users": len(active_sessions),
        "server_time": datetime.now().isoformat()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
