var http=require('http');
var url=require('url');
var fs=require('fs');

var mime=require('mime');

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
    var camino='static'+objetourl.pathname;
    if (camino=='static/')
        camino='static/index.html';
    fs.exists(camino,function(existe){
        if (existe) {
            fs.readFile(camino,function(error,contenido){
                if (error) {
                    respuesta.writeHead(500, {'Content-Type': 'text/plain'});
                    respuesta.write('Error interno');
                    respuesta.end();                    
                } else {
                    var tipo=mime.lookup(camino);
                    console.log(tipo);
                    respuesta.writeHead(200, {'Content-Type': tipo});
                    respuesta.write(contenido);
                    respuesta.end();
                }
            });
        } else {
            respuesta.writeHead(404, {'Content-Type': 'text/html'});
            respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');        
            respuesta.end();
        }
    });
});

servidor.listen(8888);

console.log('Servidor web iniciado');
