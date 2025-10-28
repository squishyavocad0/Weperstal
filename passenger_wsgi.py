import os
import sys

# Add your app directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Import your Node.js app (this is just a placeholder)
# The actual Node.js app will be handled by Passenger
def application(environ, start_response):
    status = '200 OK'
    headers = [('Content-Type', 'text/plain')]
    start_response(status, headers)
    return [b'Node.js app should be running']
