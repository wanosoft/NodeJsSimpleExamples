var http=require('http');
var url=require('url');
var fs=require('fs');
var querystring = require('querystring');

var mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
    var camino='public'+objetourl.pathname;
    if (camino=='public/')
        camino='public/index.html';
    encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);


function encaminar (pedido,respuesta,camino) {
    switch (camino) {
        case 'public/cargar': {
            grabarComentarios(pedido,respuesta);
            break;
        }    
        case 'public/leercomentarios': {
            leerComentarios(respuesta);
            break;
        }            
        default : {  
            fs.exists(camino,function(existe){
                if (existe) {
                    fs.readFile(camino,function(error,contenido){
                        if (error) {
                            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
                            respuesta.write('Error interno');
                            respuesta.end();                    
                        } else {
                            var vec = camino.split('.');
                            var extension=vec[vec.length-1];
                            var mimearchivo=mime[extension];
                            respuesta.writeHead(200, {'Content-Type': mimearchivo});
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
        }
    }    
}


function grabarComentarios(pedido,respuesta) {
    var info = '';
    pedido.on('data', function(datosparciales){
         info += datosparciales;
    });
    pedido.on('end', function(){
        var formulario = querystring.parse(info);
        respuesta.writeHead(200, {'Content-Type': 'text/html'});
        var pagina='<!doctype html><html><head></head><body>'+
                   'Nombre:'+formulario['nombre']+'<br>'+
                   'Comentarios:'+formulario['comentarios']+'<br>'+
                   '<a href="index.html">Retornar</a>'+
                   '</body></html>';
        respuesta.end(pagina);
        grabarEnArchivo(formulario); 
    });    
}

function grabarEnArchivo(formulario) {
    var datos='nombre:'+formulario['nombre']+'<br>'+
              'comentarios:'+formulario['comentarios']+'<hr>';
    fs.appendFile('public/visitas.txt',datos,function(error){
        if (error)
            console.log(error);
    });
}

function leerComentarios(respuesta) {
    fs.readFile('public/visitas.txt',function (error,datos) {
        respuesta.writeHead(200, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>');
        respuesta.write(datos);
        respuesta.write('</body></html>');
        respuesta.end();          
    });
}

console.log('Servidor web iniciado');
