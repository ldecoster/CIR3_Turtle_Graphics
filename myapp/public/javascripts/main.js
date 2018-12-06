(function(){
    var draw_zone = SVG('draw_area').size(1050, 600);
    var curent_position = [0,0];
    var current_angle = 0;
    var current_color = "#000000";
    var current_thickness = 1;
    var current_line_end = 'round';

    //definitions des propriétés de la zone de travail
    var size = [500,500];
    //var limits = [0,0,0,0];
    var origin_offset = [0,0];

    var speed = 5;
    var nb_line = 0;

    speedBtn = document.getElementById("drawSpeed");
    speedBtn.addEventListener("input", function(event) {
        speed = event.target.value;
    });


    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    
    var errorDiv = $('#error_message');

    launchBtn = document.getElementById("validate_code");
    launchBtn.addEventListener("click", function(event) {
        event.preventDefault();
        code = editor.getValue();
        errorDiv.text(">_ ");

        var data = {'data' : code};
        $.ajax({
            type : "POST",
            contentType : "application/json",
            url : window.location,
            data : JSON.stringify(data),
            dataType : 'json',
            success : function(data) {
                //console.log('Data renvoyée par le serveur :'); 
                //console.log(data);
                updateDisplay(data);
            },
            error : function(e) {
                alert("Erreur de commande !");
                htmlError = e.responseText;
                var d = $('<div>').html(htmlError);
                var h1Content = d.children()[2].innerHTML.split("^");
                var lineError = h1Content[0].split(":")[0].replace( /[^\d\.]*/g, '');
                var errorMessage = '('+lineError+') '+h1Content[1];
                errorDiv.append(errorMessage);

                // Rajoute une croix rouge devant la 1ère ligne erronée
                var editorDiv = document.getElementById("editor");
                editorDiv.children[1].firstChild.children[lineError-1].classList.add("ace_error");

            }
        });
    });

    clearDrawBtn = document.getElementById("clear_draw");
    clearDrawBtn.addEventListener("click", function(event) {
        event.preventDefault();
        draw_zone.clear();
    });

    clearAllBtn = document.getElementById("clear_all");
    clearAllBtn.addEventListener("click", function(event) {
        event.preventDefault();
        editor.setValue("");
        errorDiv.text(">_ ");
        draw_zone.clear();
    });

    

    var convert_polar = function(distance,angle){
        current_angle = current_angle + angle;
        var x_composante =  curent_position[0] + Math.round(distance*Math.cos((Math.PI/180)*(current_angle + angle_offset*0)));
        var y_composante =  curent_position[1] + Math.round(distance*Math.sin((Math.PI/180)*(current_angle + angle_offset*0)));
        if(x_composante>size[0]){x_composante=size[0]};
        if(y_composante>size[1]){x_composante=size[1]};
        return([x_composante,y_composante]);
    }

    var draw = function(x1,y1,speed_){
        properties = { color: current_color, width: current_thickness, linecap: current_line_end };
        var delay = nb_line*speed_;

        //console.log(nb_line);

        putline(draw_zone,
                origin_offset[0] + curent_position[0],
                origin_offset[1] + curent_position[1],
                origin_offset[0] + x1, 
                origin_offset[1] + y1,
                properties,
                speed,
                delay
                );
    }

    var teleport = function(x,y){curent_position = [x,y];}

    // Affichage du graphe

    var putline = function(context,x0, y0, x1, y1, properties,speed_, delay_){
        console.log(speed_);
        context.line(x0,y0,x1,y1).stroke(properties).animate({duration : speed_, ease: '<', delay: delay_ }).during(function(t, morph) {this.attr({x2:morph(x0, x1), y2: morph(y0, y1)})});
    }

    var updateDisplay = function(command_array){
       
        nb_line = 0;
        current_color = "#000000";
        for(let command of command_array){
            if(command.cmd === 'TELEPORT'){
                teleport(command.val[0],command.val[1]);		
            }
            if(command.cmd === 'MOVE'){
                s = curent_position;
                e = command.val;
                nb_line++;
                draw(e[0],e[1],speed);
                console.log(speed);
                teleport(command.val[0],command.val[1]);
            }

            if(command.cmd === 'COLOR'){current_color = command.val;}

            if(command.cmd === 'TURN'){

            }
        }
    };


})();

