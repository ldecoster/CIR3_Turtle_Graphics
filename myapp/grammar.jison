/* description:  */

/* lexical grammar */
%lex
%options case-insensitive
%%

\s+                                              /* skip whitespace */
";"                                                 return 'SEMI_COLON'
","                                                 return 'COMMA'
"="                                                 return 'EQ'

"DEF_ESPACE"                                        return 'SET_AREA'
"DEF_ORIGINE"                                       return 'SET_ORIGIN'
"AVANCER"                                           return 'MOVE'
"TELEPORTER"                                        return 'TELEPORT'
"GAUCHE"                                            return 'LEFT'
"DROITE"                                            return 'RIGHT'
"TOURNER"                                           return 'TURN'
"COULEUR"                                           return 'COLOR'
"EPAISSEUR"                                         return 'THICKNESS'
"REPETER"                                           return 'REPEAT'
"FIN REPETER"                                       return 'E_REPEAT'

"*"                                                 return '*'
"/"                                                 return '/'
"-"                                                 return '-'
"+"                                                 return '+'

[0-9]+("."[0-9]+)?\b                                                return 'NUMBER'
[a-zA-Z0-9]+                                                        return 'WORD'
\$([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)                        return 'VARNAME'
(\#[a-fA-F0-9]{6})                                                  return 'HEX_CODE'
<<EOF>>                                                             return 'EOF'
.                                                                   return 'INVALID'

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
        {$$ = "Point virgule";}
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
    
    | 'MOVE' 'VARNAME' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"MOVE",val:[$2,$4], err :"0", msg:"ok"});
            
        }

    | 'MOVE' 'NUMBER' 'COMMA' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"MOVE",val:[$2,$4], err :"0", msg:"ok"});
            
        }

    | 'MOVE' 'VARNAME' 'COMMA' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"MOVE",val:[$2,$4], err :"0", msg:"ok"});
            
        }
    
    | 'MOVE' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"DIST",val:$2, err :"0"});
        }

    | 'MOVE' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"DIST",varname:$2, err :"0"});
        }

    | 'TELEPORT' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"TELEPORT",val:[$2,$4], err :"0"});
        }

    | 'COLOR' 'HEX_CODE' 'SEMI_COLON'
        {
            command_array.push({cmd:"COLOR",val:$2, err :"0",msg:"ok"});
        }

    | 'THICKNESS' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"THICKNESS",val:$2, err:"0",msg:"ok"});
        }

    | 'SET_AREA' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"SET_AREA",val:[$2,$4], err :"0"});
        }

        
    | 'SET_ORIGIN' 'NUMBER' 'COMMA' 'NUMBER' 'SEMI_COLON'
        {
            //console.log("DEFINITION DE LORIGINE ");
            //console.log($2 + ',' + $4);
            command_array.push({cmd:"SET_ORIGIN",val:[$2,$4], err :"0"});
        }


    |  'VARNAME' 'EQ' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=CSTE",val: $3, varname: $1, err :"0"});
        }

    |  'VARNAME' 'EQ' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR",val: $3, varname: $1, err :"0"});
        }
    

    | 'VARNAME' '+' '+' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR++",varname:$1, err:"0"});
        }

    | 'VARNAME' '-' '-' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR--",varname:$1, err:"0"});
        }


    |  'VARNAME' 'EQ' 'VARNAME' '+' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR+VAR",varname1: $3, varname2:$5, varname: $1, err :"0"});
        }


    |  'VARNAME' 'EQ' 'VARNAME' '+' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR+CSTE",varname1: $3, val:$5, varname: $1, err :"0"});
        }

    |  'VARNAME' 'EQ' 'NUMBER' '+' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR+CSTE",varname1: $5, val:$3, varname: $1, err :"0"});
        }

    | 'VARNAME' 'EQ' 'NUMBER' '+' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=CSTE+CSTE",val1: $5, val:$3, varname: $1, err :"0"});
        }
    

    |  'VARNAME' 'EQ' 'VARNAME' '-' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR-VAR",varname1: $3, varname2:$5, varname: $1, err :"0"});
        }


    |  'VARNAME' 'EQ' 'VARNAME' '-' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR-CSTE",varname1: $3, val:$5, varname: $1, err :"0"});
        }

    |  'VARNAME' 'EQ' 'NUMBER' '-' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR-CSTE",varname1: $5, val:$3, varname: $1, err :"0"});
        }

    | 'VARNAME' 'EQ' 'NUMBER' '-' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=CSTE-CSTE",val1: $5, val:$3, varname: $1, err :"0"});
        }


    |  'VARNAME' 'EQ' 'VARNAME' '*' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR*VAR",varname1: $3, varname2:$5, varname: $1, err :"0"});
        }

    |  'VARNAME' 'EQ' 'VARNAME' '*' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR*CSTE",varname1: $3, val:$5, varname: $1, err :"0"});
        }

    |  'VARNAME' 'EQ' 'NUMBER' '*' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR*CSTE",varname1: $5, val:$3, varname: $1, err :"0"});
        }

    | 'VARNAME' 'EQ' 'NUMBER' '*' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=CSTE*CSTE",val1: $5, val:$3, varname: $1, err :"0"});
        }


    |  'VARNAME' 'EQ' 'VARNAME' '/' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR/VAR",varname1: $3, varname2:$5, varname: $1, err :"0"});
        }

    |  'VARNAME' 'EQ' 'VARNAME' '/' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR/CSTE",varname1: $3, val:$5, varname: $1, err :"0"});
        }

    |  'VARNAME' 'EQ' 'NUMBER' '/' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=VAR/CSTE",varname1: $5, val:$3, varname: $1, err :"0"});
        }

    | 'VARNAME' 'EQ' 'NUMBER' '/' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"VAR=CSTE/CSTE",val1: $5, val:$3, varname: $1, err :"0"});
        }


    | 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"DBG_VAR", varname: $2, err :"0"});
        }


    | 'REPEAT' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"REPEAT",val:$2,index : command_array.length, err :"0"});
        }
    
    | 'E_REPEAT' 'SEMI_COLON'
        {
            command_array.push({cmd:"E_REPEAT",val:$2,index : command_array.length, err :"0"});
        }


    | 'TURN' 'NUMBER' 'SEMI_COLON'
        {
            command_array.push({cmd:"TURN",val:$2, err :"0"});
        }
    
    | 'TURN' 'VARNAME' 'SEMI_COLON'
        {
            command_array.push({cmd:"TURN",val:$2, err :"0"});
        }

    | 'TURN' 'RIGHT' 'SEMI_COLON'
        {
            command_array.push({cmd:"TURN",val:90, err :"0"});
        }
    
    | 'TURN' 'LEFT' 'SEMI_COLON'
        {
            command_array.push({cmd:"TURN",val:-90, err :"0"});
        }
    
    ;


    

/* throw new error*/
