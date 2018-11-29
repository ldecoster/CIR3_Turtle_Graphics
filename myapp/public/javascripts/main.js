(function(){
    var draw_zone = SVG('draw_area').size(1050, 600);

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    
    var errorDiv = $('#error_message');

    launch_btn = document.getElementById("validate_code");
    launch_btn.addEventListener("click", function(event) {
        event.preventDefault();
        code = editor.getValue();
        errorDiv.text("> ");
        //console.log(code);

        var data = {'data' : code};
        $.ajax({
            type : "POST",
            contentType : "application/json",
            url : window.location,
            data : JSON.stringify(data),
            dataType : 'json',
            success : function(data) {
                console.log('Data renvoyée par le serveur :'); 
                console.log(data);
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
            }
        });
    });

    clear_btn = document.getElementById("clear_code");
    clear_btn.addEventListener("click", function(event) {
        event.preventDefault();
        editor.setValue("");
        errorDiv.text("> ");
        draw_zone.clear();
    });

    var updateDisplay = function(command_array){

        var temp_point = new Array();
        var polygon_collection = new Array();

        // Création de la collection de polygones qui seront ensuite affichés
        for(let command of command_array){
            if(command.cmd === 'TELEPORT'){

                if(temp_point.length !== 0){
                    polygon_collection.push(temp_point);
                }

                temp_point = new Array();
                temp_point.push(command.val);			
            }
            if(command.cmd === 'MOVE'){
                temp_point.push(command.val);
            }
        }
        
         //ajout du dernier polygone à la collection
         polygon_collection.push(temp_point);
         temp_point = new Array();

        // Affichage du graphe

        var putline = function(context,x0, y0, x1, y1, properties,delay_){
            context.line(x0,y0,x1,y1).stroke(properties).animate({duration : 100, ease: '<', delay: delay_ }).during(function(t, morph) {this.attr({x2:morph(x0, x1), y2: morph(y0, y1)})});
            console.log(delay_);
        }

        nb_line = 0;

        for(let i=0; i < polygon_collection.length; i++) {
            if(polygon_collection[i].length >= 2){
                for(let j = 0; j+1<polygon_collection[i].length; j++){
                    nb_line++;
                    //console.log(nb_line)
                    var s = polygon_collection[i][j];
                    var e = polygon_collection[i][j+1];
                    console.log(s);
                    putline(draw_zone,s[0],s[1],e[0],e[1],{ width: 1, color:'#FF5500' },nb_line*110);
                }
            }
        }
    };


})();

