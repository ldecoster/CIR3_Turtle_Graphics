/* description:  */

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
";"                     return 'SEMI_COLON'
","                     return 'COMMA'

"AVANCER"               return 'MOVE'
"TELEPORTER"            return 'TELEPORT'
"DEF_ESPACE"            return 'SET_AREA'
"DEF_ORIGINE"           return 'SET_ORIGIN'

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
            console.log($1 +' Commande inconnue, commande ignorée')    
        }
    
    
    | 'MOVE' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            if(type($6)){
                console.log('parametre manquant');
            }
            command_array.push({cmd:"MOVE",val:[$2,$4]});
            
        }
    | 'TELEPORT' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            //console.log("TELEPORTATION EN ");
            //console.log($2 + ',' + $4);
            command_array.push({cmd:"TELEPORT",val:[$2,$4]});
        }
    | 'SET_AREA' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            //console.log("DEFINITION TAILLE CANVAS");
            //console.log($2 + ',' + $4);
            command_array.push({cmd:"SET_AREA",val:[$2,$4]});
        }
    | 'SET_ORIGIN' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            //console.log("DEFINITION DE LORIGINE ");
            //console.log($2 + ',' + $4);
            command_array.push({cmd:"SET_ORIGIN",val:[$2,$4]});
        }
    ;


    

/* throw new error*/