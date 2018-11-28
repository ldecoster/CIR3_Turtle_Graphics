(function(){
    var draw_zone = SVG('draw_area').size(1920, 1080);

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    //editor.session.setMode("ace/mode/javascript");
    
    launch_btn = document.getElementById("validate_code");
    disp = document.getElementById("disp");

    launch_btn.addEventListener("click", function(event){
        event.preventDefault();
        code = editor.getValue();

        disp.innerHTML = code;
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
                //console.log(data);
                updateDisplay(data);
            },
            error : function(e) {
                alert("Error!")
                console.log("ERROR: ", e);
            }
        });
    });


var updateDisplay = function(command_array){

    var temp_point = new Array();
    var polygon_collection = new Array();

	for(let i = 0; i < Object.keys(command_array).length; i++){
		if(command_array[i].cmd == 'TELEPORT'){
			
				polygon_collection.push(temp_point);
				temp_point = new Array();
				temp_point.push(command_array[i].val);			
		}
		if(command_array[i].cmd == 'MOVE'){
            temp_point.push(command_array[i].val);
            //console.log(temp_point.length);
        }

		for(let i = 0; i<polygon_collection.length;i++){
				if(polygon_collection[i].length>=2){
					for(let j = 0;j+1<polygon_collection[i].length;j++){
						var s = polygon_collection[i][j];
						var e = polygon_collection[i][j+1];
						var line = draw_zone.line(s[0],s[1],e[0],e[1]).stroke({ width: 1, color:'#FF5500' });
					}
				}
			}
    }

    console.log("collection de polygones :");
    console.log(polygon_collection);

}
	


})();
