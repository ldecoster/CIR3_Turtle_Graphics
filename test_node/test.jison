
/* description:  */

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
";"                     return 'POINT_VIRGULE'
[0-9]+("."[0-9]+)?\b    return 'NOMBRE'
[a-zA-Z0-9]+            return 'MOT'
<<EOF>>                 return 'EOF'
.                       return 'INVALIDE'

/lex

/* operator associations and precedence */



%start html

%% /* language grammar */

html
    : contenus EOF
        { typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; }
    ;

contenus
    : contenu
        {$$ = $1;}
    | contenus contenu
        {$$ =  $1 + $2;}
    ;

contenu
    : NOMBRE
        {$$ = Number(yytext);}
    | MOT
        {$$ = yytext;}
    | POINT_VIRGULE
        {$$ = "Point virgule";}
;

/* throw new error*/