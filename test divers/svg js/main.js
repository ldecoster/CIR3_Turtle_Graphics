(function(){




    //definitions des  propriétés de la Delorean
    var curent_position = [0,0];
    var current_angle = 0;
    var current_color = "#000000";
    var current_thickness = 1;
    var current_line_end = 'round';


    //definitions des propriétés de la zone de travail
    var size = [500,500];
    //var limits = [0,0,0,0];
    var origin_offset = [0,0];

    //ne sera pas modifiable par l'user
    var angle_offset = Math.PI/2;

    //def contexte
    var draw_zone = SVG('drawing').size(size[0], size[1]);




    speed = 100;
    var rect = draw_zone.rect(5, 5).fill('#00FF00');//.move(500,500).animate({duration : speed, ease: '<', delay: 0 });
    //rect.attr('x', '10%').animate().attr('x', '50%');
    rect.move(50,50);
    rect.animate({ ease: '<', delay: 100, duration :1500 }).move(400,400);
    rect.animate({ ease: '<', delay: 1500, duration :1500 }).move(10,400);
    rect.animate({ ease: '<', delay: 100, duration :1500 }).attr({ fill: '#0000FF' });

    var rect2 = draw_zone.rect(15, 15).fill('#FF0000');

    rect2.animate({ ease: '<', delay: 100, duration :1 }).attr({ fill: '#0000FF' });
    //def fonctions
    var putline = function(context,x0, y0, x1, y1, properties){
        var line = context.line(x0,y0,x1,y1);
        line.stroke(properties);
        console.log('a line has been drawn');
    }

    var convert_polar = function(distance,angle){
        current_angle = current_angle + angle;
        var x_composante =  curent_position[0] + Math.round(distance*Math.cos((Math.PI/180)*(current_angle + angle_offset*0)));
        var y_composante =  curent_position[1] + Math.round(distance*Math.sin((Math.PI/180)*(current_angle + angle_offset*0)));
        if(x_composante>size[0]){x_composante=size[0]};
        if(y_composante>size[1]){x_composante=size[1]};
        return([x_composante,y_composante]);
    }

    var draw = function(x1,y1, color = current_color, line_end = current_line_end, thickness = current_thickness){
        
        current_color = color;
        current_line_end = line_end;
        current_thickness = thickness;

        putline(draw_zone,
                origin_offset[0] + curent_position[0],
                origin_offset[1] + curent_position[1],
                origin_offset[0] + x1, 
                origin_offset[1] + y1,
                { color: current_color, width: current_thickness, linecap: current_line_end });
        curent_position = [x1,y1];
    }

    var teleport = function(x,y){curent_position = [x,y];}
    
  //Là où il faudra interpréter les commandes
    origin_offset = [260,0];

    
    for(let side = 2; side<40; side++){
        for(let i = 0; i < side; i++){
            coord = convert_polar(40,(360/side));
            draw(coord[0],coord[1],undefined,undefined,undefined);
            
        }
    }
    
    



    
}
)();