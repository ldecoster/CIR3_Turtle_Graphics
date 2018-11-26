(function(){
    var div_info = document.getElementById("info");
    var div_canvas  = document.getElementById("canvas");

    var clicked_point = new Array();

    var polygon_collection = new Array();

    var draw_zone = SVG('canvas').size(1920, 1080);
    

    var update_display = function()
    {
        var rect = draw_zone.rect(1920, 1080).fill('#ffffff');
        draw_zone.image('img/0.png');
        div_info.innerHTML = JSON.stringify(polygon_collection);


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
                console.log("nombre max d'actions retour atteint");
            }
            
            update_display();
        }
        if(keyName=='t'){
            console.log('teleport');
            polygon_collection.push(clicked_point);
            clicked_point = new Array();
            update_display();
        }
      });




})();