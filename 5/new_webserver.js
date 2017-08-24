var http=require('http');

var servidor=http.createServer(function(pedido,respuesta){
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    respuesta.write('<!doctype html><html><head></head>'+
                    '<body><h1>Sitio en desarrollo</h1></body></html>');
    respuesta.end();
});

servidor.listen(8888);

console.log('Servidor web iniciado');
