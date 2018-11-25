(function(){
    //console.log("coucou le monde");
    ace.require("ace/ext/language_tools");

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/javascript");
    
    launch_btn = document.getElementById("validate_code");
    disp = document.getElementById("disp");
    //editor = document.getElementById("editor");

    launch_btn.addEventListener("click", function(event){
        event.preventDefault();
        code = editor.getValue();

        disp.innerHTML = code;
        console.log(code);

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
            },
            error : function(e) {
                alert("Error!")
                console.log("ERROR: ", e);
            }
        });
    });

})();
