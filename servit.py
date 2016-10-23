import SimpleHTTPServer
import SocketServer
PORT = 8002
HOST = ""
import sys
if len(sys.argv) > 1:
    HOST = sys.argv[1]
if len(sys.argv) > 2:
    PORT = int(sys.argv[2])
Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
SocketServer.TCPServer.allow_reuse_address = True
httpd = SocketServer.TCPServer((HOST, PORT), Handler)
print "serving at %s:%s" % (HOST, PORT)
httpd.serve_forever()
