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
                var h1 = d.children()[2];
                var errorMessage = h1.innerHTML.split("^")[1];
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
        for(let polygon of polygon_collection){
            if(polygon.length >= 2){
                for(let j = 0; j+1<polygon.length; j++){
                    var s = polygon[j];
                    var e = polygon[j+1];
                    var line = draw_zone.line(s[0],s[1],e[0],e[1]).stroke({ width: 1, color:'#FF5500' });
                }
            }
        }

        console.log("collection de polygones :");
        console.log(polygon_collection);
    };



})();
