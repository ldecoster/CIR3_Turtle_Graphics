(function(){
    var div_info = document.getElementById("info");
    var div_canvas  = document.getElementById("canvas");

    var cursor_pos = [0,0];
    var precision = 10;

    var clicked_point = new Array();

    var polygon_collection = new Array();

    var draw_zone = SVG('canvas').size(1920, 1080);
    

    var update_display = function()
    {
        draw_zone.rect(1920, 1080).fill('#FFFFFF');
        draw_zone.image('img/1.jpg');
        draw_zone.circle(precision).fill('#00FF00').move(cursor_pos[0],cursor_pos[1])
        

        var string_code = '';

        for(let i = 0; i < polygon_collection.length; i++){
            for(let j = 0; j < polygon_collection[i].length; j++){
                if(j==0){
                    string_code = string_code + 'TELEPORTER '+ polygon_collection[i][j][0] + ',' + polygon_collection[i][j][1] + '; <br>';
                }else{
                    string_code = string_code + 'AVANCER '+ polygon_collection[i][j][0] + ',' + polygon_collection[i][j][1] + '; <br>';
                }
            }

        }

        div_info.innerHTML = string_code;


        if(clicked_point.length>=2){
            for(let i = 0;i+1<clicked_point.length;i++){
                var s = clicked_point[i];
                var e = clicked_point[i+1];
                var line = draw_zone.line(s[0],s[1],e[0],e[1]).stroke({ width: 1, color:'#00FF00' });

            }
        }


        for(let i = 0; i<polygon_collection.length;i++){
            if(polygon_collection[i].length>=2){

                for(let j = 0;j+1<polygon_collection[i].length;j++){

                    var s = polygon_collection[i][j];
                    var e = polygon_collection[i][j+1];
                    var line = draw_zone.line(s[0],s[1],e[0],e[1]).stroke({ width: 1, color:'#FF5500' });
    
                    //line.stroke("");
                }
            }
        }
    }

    update_display();

    var click_register = function(event){
        clicked_point.push([event.clientX,event.clientY]);
        console.log(clicked_point.length);
        update_display();
    }


    div_canvas.addEventListener('click',click_register,false);

    document.addEventListener('keydown', (event) => {
        const keyName = event.key;
        if(keyName=='z'){
            if(clicked_point.length>1){
                clicked_point.pop();
            }else{
               polygon_collection.pop();
            }
            
            update_display();
        }
        if(keyName=='t'){
            console.log('teleport');
            polygon_collection.push(clicked_point);
            clicked_point = new Array();
            update_display();
        }

        if(keyName=='o'){
            cursor_pos[1]--;
            update_display();
        }

        if(keyName=='l'){
            cursor_pos[1]++;
            update_display();
        }
        
        if(keyName=='k'){
            cursor_pos[0]--;
            update_display();
        }

        if(keyName=='m'){
            cursor_pos[0]++;
            update_display();
        }

        if(keyName=='a'){
            clicked_point.push([cursor_pos[0],cursor_pos[1]]);
            update_display();
        }

        if(keyName=='i'){
            precision--;
            update_display();
        }

        if(keyName=='p'){
            precision++;
            update_display();
        }



      });




})();