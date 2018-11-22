(function(){
    //console.log("coucou le monde");
    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");

    launch_btn = document.getElementById("validate_code");
    disp = document.getElementById("disp");
    //editor = document.getElementById("editor");

    launch_btn.addEventListener("click", function(event){
        console.log(disp);
        disp.innerHTML = editor.getValue();
        console.log(editor.getValue());
        console.log(disp);

    });
})();
