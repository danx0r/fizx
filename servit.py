import SimpleHTTPServer
import SocketServer
PORT = 8002
Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
SocketServer.TCPServer.allow_reuse_address = True
httpd = SocketServer.TCPServer(("", PORT), Handler)
print "serving at port", PORT
httpd.serve_forever()
