var http=require('http');
var url=require('url');

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
    console.log('camino completo del recurso y parametros:'+objetourl.path);
    console.log('solo el camino y nombre del recurso     :'+objetourl.pathname)
    console.log('parametros del recurso                  :'+objetourl.query)
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    respuesta.write('<!doctype html><html><head></head><body>Hola mundo</body></html>');
    respuesta.end();
});

servidor.listen(8888);

console.log('Servidor web iniciado');
