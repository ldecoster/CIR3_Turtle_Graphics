(function(){
    
    //definitions des propriétés de la zone de travail
    var size = [1900,500];
    var limits = [0,0,0,0];

    //definitions des propriétés de la Delorean

    var current_pos = [0,0];
    var origin_offset = [0,0];
    var color = [0,0,0,0]; //rgba

    //def contexte
    var draw = SVG('drawing').size(size[0], size[1]);

    //def fonctions
    var putline = function(context,x0, y0, x1, y1, properties){
        var line = context.line(x0,y0,x1,y1);
        line.stroke(properties);
        console.log('a line has been drawn');
    }

    //tests 
    var nb_line = 3000;
    var rand_coord = Array(nb_line);


    for(let i = 0; i<nb_line; i++){
        rand_coord[i] = [Math.floor(Math.random()*size[0]),Math.floor(Math.random()*size[1])];
    }
    for(let i = 0; i<nb_line-1; i++){
        putline(draw,rand_coord[i][0],rand_coord[i][1],rand_coord[i+1][0],rand_coord[i+1][1],{ color: '#000', width: 1, linecap: 'round' });
    }

    //console.log(Math.floor(Math.random()*size[1]));


  



   


    

   
   /* var rect = draw.rect(150, 100).attr({ fill: '#f12' });

    var line = draw.line(50,10, 50, 50);
    line.stroke({ color: '#000', width: 10, linecap: 'round' });
    
    var line = draw.line(32,25, 75, 25);*/






    
}
)();