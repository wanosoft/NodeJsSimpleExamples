var http=require('http');
var url=require('url');
var fs=require('fs');

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
        case 'public/listanumeros': {
            listar(pedido,respuesta);
            break;
        }    
        case 'public/listadotabla': {
            listarTablaMultiplicar(pedido,respuesta);
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


function listar(pedido,respuesta) {
    var info = '';
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    var pagina='<!doctype html><html><head></head><body>';
    for(var f=1;f<=20;f++) {
       pagina+='<a href="listadotabla?num='+f+'">'+f+'</a><br>';
    }
    pagina+='</body></html>';
    respuesta.end(pagina);
}

function listarTablaMultiplicar(pedido,respuesta) {
    var valor=url.parse(pedido.url,true).query.num;
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    var pagina='<!doctype html><html><head></head><body>';
    for(var f=1;f<=10;f++) {
        pagina+=valor+'*'+f+'='+(valor*f)+'<br>';
    }           
    pagina+='</body></html>';
    respuesta.end(pagina);
}


console.log('Servidor web iniciado');
