%lex

%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"#"[A-Fa-f0-9]{6}     return 'COLOR'
"degree"              return 'ANGLE_UNIT'
"radian"              return 'ANGLE_UNIT'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'
"PI"                  return 'PI'
"E"                   return 'E'
<<EOF>>               return 'EOF'
"="                   return 'EQUAL'
";"                   return 'SEMICOLON'
":"                   return 'COLON'

"var"                 return 'VAR'

"c:"                   return 'C_OPT'
"l:"                   return 'L_OPT'
"a:"                   return 'A_OPT'
"u:"                   return 'U_OPT'
"r:"                   return 'R_OPT'

"tracer"              return 'DRAW'
"tourner"             return 'TURN'
"déplacer"            return 'MOVE'
"rectangle"           return 'RECTANGLE'
"cercle"              return 'CIRCLE'
"couleur_fond"        return 'BACKGROUND_COLOR'
"elipse"              return 'ELIPSE'
"repeter"             return 'FOR'

[A-Za-z_]+[A-Za-z0-9_]* return 'IDENTIFIER'
/lex

%{
    turtle_x = 0;
    turtle_y = 0;
    turtle_angle = 0;
    var instructions = []
    var variables = new Map();
    var base_options = {
        draw: {
            color: "#000000",
            width: 1,
            rounded: 0
        },
        rectangle: {
            color: "#000000",
            width: 1,
            rounded: 0,
            fill: 0
        }
    };
%}

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start pgm

%% /* language grammar */

pgm
    : elements EOF
        {
            yy.instructions = instructions;
            yy.variables = variables;
            console.log("====== INSTRUCTIONS ======");
            console.log(instructions); 
            console.log("====== VARIABLES ========");
            console.log(variables);
            console.log("====== FINAL VALUE =======");
            console.log("turtle x: " + String(turtle_x));
            console.log("turtle y: " + String(turtle_y));
            console.log("turtle angle: " + String(turtle_angle));
        }
    ;

elements
    : commande elements
    | commande
    ;

commande 
    /* Rules for variables management */
    : 'VAR' 'IDENTIFIER' 'EQUAL' expr 'SEMICOLON'
        {
            if(!variables[String($2)]){
                variables[String($2)] = Number($4);
            }else{
                throw new Error("variable " + String($2) + " allready defined before");
            }
        }
    | 'IDENTIFIER' 'EQUAL' expr 'SEMICOLON'
        {
            if(variables[String($1)]){
                variables[String($1)] = Number($3);
            }else{
                throw new Error("Variable " + String($1) + " must be declared before assignation");
            }
        }
    /* Rules for draw command*/
    | 'DRAW' expr opt_draw opt_draw opt_draw 'SEMICOLON'
        {
            var options = base_options.draw;
            if($3.type){
                options[$3.type] = $3.value;
            }
            if($4.type){
                options[$4.type] = $4.value;
            }
            if($5.type){
                options[$5.type] = $5.value;
            }
            var x = turtle_x + Math.round(Number($2) * Math.cos(turtle_angle));
            var y = turtle_y + Math.round(Number($2) * Math.sin(turtle_angle));
            instructions.push({
                command: "DRAW",
                from: {
                    x: turtle_x,
                    y: turtle_y
                },
                to: {
                    x: x,
                    y: y
                },
                options: options
            });
            turtle_x = x;
            turtle_y = y;
        }
    | 'DRAW' expr 'COLON' expr opt_draw opt_draw opt_draw 'SEMICOLON'
        {
            var options = base_options.draw;
            if($5.type){
                options[$5.type] = $5.value;
            }
            if($6.type){
                options[$6.type] = $6.value;
            }
            if($7.type){
                options[$7.type] = $7.value;
            }
            var x = turtle_x + Number($2);
            var y = turtle_y + Number($4);
            instructions.push({
                command: "DRAW",
                from: {
                    x: turtle_x,
                    y: turtle_y
                },
                to: {
                    x : x,
                    y : y
                },
                options: options
            });
            turtle_x = x;
            turtle_y = y;
        }
    /* Rules for turn command*/
    | 'TURN' expr 'U_OPT' 'ANGLE_UNIT' 'SEMICOLON'
        {
            var angle = Number($2);
            if(String($4) === "radian"){
                angle = angle * (Math.PI/180);
            }
            turtle_angle += angle;
        }
    | 'TURN' expr 'SEMICOLON'
        {
            turtle_angle += Number($2);
        }
    | 'MOVE' expr 'SEMICOLON'
        {
            turtle_x += Math.round(Number($2) * Math.cos(turtle_angle));
            turtle_y += Math.round(Number($2) * Math.sin(turtle_angle));
        }
    | 'MOVE' expr 'COLON' expr 'SEMICOLON'
        {
            turtle_x += Number($2);
            turtle_y += Number($4);
        }
    | 'RECTANGLE' expr expr opt_rect opt_rect opt_rect opt_rect 'SEMICOLON'
        {
            var options = base_options.rectangle;
            if($4.type){
                options[$4.type] = $4.value;
            }
            if($5.type){
                options[$5.type] = $5.value;
            }
            if($6.type){
                options[$6.type] = $6.value;
            }
            if($7.type){
                options[$7.type] = $7.value;
            }
            instructions.push({
                command: "RECTANGLE",
                pos: {
                    x: turtle_x,
                    y: turtle_y
                },
                angle: turtle_angle, 
                width: Math.abs(Number($2)),
                height: Math.abs(Number($3)),
                options: options
            });
        }
    ;

expr
    : expr '+' expr
        {$$ = $1+$3;}
    | expr '-' expr
        {$$ = $1-$3;}
    | expr '*' expr
        {$$ = $1*$3;}
    | expr '/' expr
        {$$ = $1/$3;}
    | expr '^' expr
        {$$ = Math.pow($1, $3);}
    | expr '!'
        {{
          $$ = (function fact (n) { return n==0 ? 1 : fact(n-1) * n })($1);
        }}
    | expr '%'
        {$$ = $1/100;}
    | '-' expr %prec UMINUS
        {$$ = -$2;}
    | '(' expr ')'
        {$$ = $2;}
    | NUMBER
        {$$ = Number(yytext);}
    | IDENTIFIER 
        {
            if(variables[String($1)]){
                $$ = Number(variables[String($1)])
            }else{
                throw new Error("variable " + String($1) + " must be declared before");
            }
        }
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    ; 

opt_draw
    : 'C_OPT' 'COLOR'
        {
            $$ = {type: "color", value: String($2)}
        }
    | 'L_OPT' expr
        {
            $$ = {type: "width", value: Math.abs(Number($2))}
        }
    | 'A_OPT' expr
        {
            $$ = {type: "rounded", value: Boolean($2) ? 1 : 0 }
        }
    |
        {$$ = {}}
    ;

opt_rect
    : 'C_OPT' 'COLOR'
        {
            $$ = {type: "color", value: String($2)}
        }
    | 'R_OPT' expr
        {
            $$ = {type: "fill", value: Boolean($2) ? 1 : 0}
        }
    | 'A_OPT' expr
        {
            $$ = {type: "rounded", value: Boolean($2) ? 1 : 0}
        }
    | 'L_OPT' expr
        {
            $$ = {type: "width", value: Math.abs(Number($2))}
        }
    |   {$$ = {}}
    ;
%%