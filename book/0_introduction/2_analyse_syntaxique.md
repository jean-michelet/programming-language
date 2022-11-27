# Analyse syntaxique

## Définition
L'analyse syntaxique est le processus consistant à vérifier la syntaxe d'un programme
et générer une structure de données appelé `AST` 
(**Arbre de la syntaxe abstraite** ou **abstract syntax tree** en anglais).
Un AST est une structure de données représentant le code source, il peut servir de base pour être compilé en un code objet ou être directement interpété par un programme
généralement appelé ***AST interpreter*** ou ***Tree-Walk Interpreter***.

## Parser
Le parser (analyseur syntaxique) est le programme chargé d'effectuer l'analyse syntaxique. Il parcourt l'ensemble des tokens extraits par le scanner afin de valider la syntaxe et génèrer l'AST.

### Exemple de processus de transformation

Code source :
```js
let myNum = 1 + 1;
```

Ensemble de tokens générés par le scanner à partir du code source :
```js
const tokenMap = ['let', 'myNum', '=', '1', '+', '1', ';'];
```

AST généré par le parser à partir de l'ensemble de tokens :
```json
{
  "type": "Program",
  "start": 0,
  "end": 18,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 18,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 17,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 9,
            "name": "myNUm"
          },
          "init": {
            "type": "BinaryExpression",
            "start": 12,
            "end": 17,
            "left": {
              "type": "Literal",
              "start": 12,
              "end": 13,
              "value": 1,
              "raw": "1"
            },
            "operator": "+",
            "right": {
              "type": "Literal",
              "start": 16,
              "end": 17,
              "value": 1,
              "raw": "1"
            }
          }
        }
      ],
      "kind": "let"
    }
  ],
  "sourceType": "module"
}
```
> AST généré depuis le site [AST Explorer](https://astexplorer.net).

Même si ce genre d'AST, contenant beaucoup d'informations est très utile pour 
débugger et manipuler du code source, il est généralement plus simple d'interpréter du
code sous une forme plus primitive appellé **S-expression**. La **S-expression** est une convention utilisées notamment dans les langages de la famille de langages 
Lisp [[7]](https://lisp-lang.org), nous allons l'utiliser dans ce livre.

Représentation de l'AST sous forme de S-expression:

```js
const SExpressionAST = parser.parse('let myNUm = 1 + 1 * 2;')
```

Output :
```js
['let', 'myNum', ['+', 1, 1]]
```

Beaucoup plus clair non ?
Nous aurions pu développer plusieurs analyseurs syntaxiques ou un programme permettant
de transformer un AST complexe en un AST sous forme S-expression mais ce serait trop ambitieux
pour ce livre. Cela peut néanmoins être une tâche intéressante à réaliser de votre côté afin
de consolider vos connaissances.