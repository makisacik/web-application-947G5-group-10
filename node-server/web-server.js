/**
 * node js server to run app on local server
 */

var http = require('http')
var fs = require('fs')

const PORT = 8081

fs.readFile('../html/pyramid.html', function(error,html) {
	if (error) throw error;
	http.createServer(function(request,response){
		response.writeHeader(200, {"Content-Type": "text/html"});
		//response.writeHeader(200, {"Content-Type": "text/javascript"});
		response.write(html);
		//response.write('<html><body><h1>PolySphere Pyramid Puzzle Test</h1></body></html>');
		response.end();
	   }).listen(PORT)
});

/*var server = http.createServer(function(req,res){
	
	if (req.url == '../html/pyramid.html')
	{
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.writeHead(html);
		res.end();
	}
	else if (req.url == '../js/pyramid-script.js')	{
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<html><body><h1>PolySphere Pyramid Puzzle Solved</h1></body></html>');
		res.end();
	} else 
		res.end('404 not found');
	
});
server.listen(PORT);
*/