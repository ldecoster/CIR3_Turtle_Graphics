/* description:  */

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
";"                     return 'SEMI_COLON'
","                     return 'COMMA'

"DEF_ESPACE"            return 'SET_AREA'
"DEF_ORIGINE"           return 'SET_ORIGIN'
"AVANCER"               return 'MOVE'
"TELEPORTER"            return 'TELEPORT'
"TOURNER_GAUCHE"        return 'TURN_LEFT'
"TOURNER_DROITE"        return 'TURN_RIGHT'
"TOURNER_ANGLE"         return 'TURN_ANGLE'
"COLOR"                 return 'COLOR'

[0-9]+("."[0-9]+)?\b    return 'NUMBER'
[a-zA-Z0-9]+            return 'WORD'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

/lex

%{
var command_array = [];

%}

/* operator associations and precedence */



%start analysis

%% /* language grammar */

analysis
    : contenus EOF
        { 
            yy.command_array = command_array;
            //console.log(command_array);
            //typeof console !== 'undefined' ? console.log($1) : print($1);
            return command_array;
        }
    ;

contenus
    : commandes
        {$$ = $1;}
    | commandes contenus
        {$$ =  $1 + $2;}    
    ;

contenu
    : NUMBER
        {$$ = Number(yytext);}
    | WORD
        {$$ = yytext;}
    | SEMI_COLON
        {$$ = "Point virgoule";}
    ;

commandes
    : 'WORD' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd: $1 ,val:[$2,$4], err :"1", msg :"commande inconnue"});   
        }
    

    
    | 'MOVE' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"MOVE",val:[$2,$4], err :"0", msg:"ok"});
            
        }

    | 'MOVE' 'NUMBER' 'COMMA' 'SEMI_COLON'
        {
            command_array.push({cmd:"MOVE",val:[], err :"1", msg:"il doit y avoir deux coordonnees e.g : AVANCER x,y"});
        }
    | 'MOVE' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"MOVE",val:[], err :"1", msg:"il doit y avoir deux coordonnees e.g : AVANCER x,y"});
        }

    | 'MOVE' 'WORD' 'COMMA' 'WORD' 'SEMI_COLON'
        {
            command_array.push({cmd:"MOVE",val:[], err :"1", msg:"Les coordonnees doivent etre des nombres entiers e.g : AVANCER 42,57"});
        }



    | 'TELEPORT' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"TELEPORT",val:[$2,$4], err :"0"});
        }

    | 'TELEPORT' 'NUMBER' 'COMMA' 'SEMI_COLON'
        {
            command_array.push({cmd:"TELEPORT",val:[$2,$4], err :"0", msg:"il doit y avoir deux coordonnees e.g : TELEPORTER x,y"});
        }

    | 'TELEPORT' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"TELEPORT",val:[$2,$4], err :"0", msg:"il doit y avoir deux coordonnees e.g : TELEPORTER x,y"});
        }

    | 'TELEPORT' 'WORD' 'COMMA' 'WORD' 'SEMI_COLON'
        {
            command_array.push({cmd:"TELEPORT",val:[$2,$4], err :"0",msg:"Les coordonnees doivent etre des nombres entiers e.g : TELEPORTER 42,57"});
        }




    | 'SET_AREA' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            //console.log("DEFINITION TAILLE CANVAS");
            //console.log($2 + ',' + $4);
            command_array.push({cmd:"SET_AREA",val:[$2,$4], err :"0"});
        }


        
    | 'SET_ORIGIN' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            //console.log("DEFINITION DE LORIGINE ");
            //console.log($2 + ',' + $4);
            command_array.push({cmd:"SET_ORIGIN",val:[$2,$4], err :"0"});
        }
    ;

%{



%}
    

/* throw new error*/