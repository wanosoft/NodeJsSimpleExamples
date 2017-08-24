var http=require('http');
var url=require('url');
var fs=require('fs');

var mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  :    'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

var cache={};

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
    var camino='static'+objetourl.pathname;
    if (camino=='static/')
        camino='static/index.html';
    if (cache[camino]) {
        var vec = camino.split('.');
        var extension=vec[vec.length-1];
        var mimearchivo=mime[extension];
        respuesta.writeHead(200, {'Content-Type': mimearchivo});
        respuesta.write(cache[camino]);
        respuesta.end();
        console.log('Recurso recuperado del cache:'+camino);               
    } else {
        fs.exists(camino,function(existe){
            if (existe) {
                fs.readFile(camino,function(error,contenido){
                    if (error) {
                        respuesta.writeHead(500, {'Content-Type': 'text/plain'});
                        respuesta.write('Error interno');
                        respuesta.end();                    
                    } else {
                        cache[camino]=contenido;
                        var vec = camino.split('.');
                        var extension=vec[vec.length-1];
                        var mimearchivo=mime[extension];
                        respuesta.writeHead(200, {'Content-Type': mimearchivo});
                        respuesta.write(contenido);
                        respuesta.end();
                        console.log('Recurso leido del disco:'+camino);
                    }
                });
            } else {
                respuesta.writeHead(404, {'Content-Type': 'text/html'});
                respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');        
                respuesta.end();
            }
        });
    }
});

servidor.listen(8888);

console.log('Servidor web iniciado');
