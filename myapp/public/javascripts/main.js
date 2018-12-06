(function(){
    var draw_zone = SVG('draw_area').size(1050, 600);
    var speed = 0;
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    
    var errorDiv = $('#error_message');

    launchBtn = document.getElementById("validate_code");
    launchBtn.addEventListener("click", function(event) {
        event.preventDefault();
        code = editor.getValue();
        errorDiv.text(">_ ");
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

    speedBtn = document.getElementById("drawSpeed");
    speedBtn.addEventListener("input", function(event) {
        speed = event.target.value;
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

        var putline = function(context,x0, y0, x1, y1, properties,speed, delay_){
            context.line(x0,y0,x1,y1).stroke(properties).animate({duration : speed, ease: '<', delay: delay_ }).during(function(t, morph) {this.attr({x2:morph(x0, x1), y2: morph(y0, y1)})});
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
                    putline(draw_zone,s[0],s[1],e[0],e[1],{ width: 1, color:'#FF5500' },speed*10,nb_line*speed*10);
                }
            }
        }
    };


})();

