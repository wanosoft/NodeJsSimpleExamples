var fs=require('fs');

fs.readFile('./archivo1.txt',function(error,datos){
    if (error) {
        console.log(error);
    }	
    else {
        console.log(datos.toString());
    }
});

console.log('última línea del programa');
