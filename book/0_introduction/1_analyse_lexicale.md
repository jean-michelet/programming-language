# Analyse lexicale

## Définition
L'analyse lexicale est le processus consistant à convertir une chaîne de caractère en une suite de **tokens**. Un token est une suite de caractères représentant une **unité lexicale**.

#### Exemples d'unités lexicales

| unité                                               | tokens                          |
|-------------------                                  |-----------                      |
| Littéraux (string, int, bool...)                    | `"hello"`, `2`, `true`          |
| Mots-clés                                           | `if`, `while`, `class`          |
| Opérateurs                                          | `+`, `=`, `>=`, `&&`            |
| Identifiants (noms de variables, fonctions, etc.)   | `x`, `printf`                   |

Un token a donc un type et une valeur, par exemple `"hello"` est la valeur d'un token de type `literal`.

Afin d'éviter toute confusion lors de vos recherches, gardez à l'esprit cette liste d'équivalences (en-fr) :
 - analyse lexicale, lexing, segmentation, tokenization
 - Analyseur lexical, scanner, tokenizer, lexer
 - token, symbole, lexème, lexeme

> Dans la première partie de ce chapitre (*Qu'est-ce qu'un langage ?*), j'ai préféré l'appelation **symbole** à **token**, car il s'agissait de définir un langage de manière générale, mais dans le contexte d'un langage de programmation, token est davantage utilisé.

## Alphabet
Nous avons vu qu'un alphabet est un ensemble fini non-vide de symboles, c'est-à-dire un ensemble de tokens admissibles. Les tokens peuvent être représentés au moyen d'expression rationnelle (regex).

#### Exemple d'alphabet
| symbole | regex |
|-------------------        |----------- |
| Espacements (ignorés)     | `^\s+` |
| Chiffres                  | `^\d+` |
| Identifiant               | `^(?!\d+)\w+` |
| Opérateur d'assignation   | `^=` |
| Opérateur d'addition      | `^+` |
| Chaîne de caractères      | `^"[^".]*"` |

Les alphabets peuvent contenir des symboles valides mais ignorés lors de l'analyse, ce qui est souvent le cas des commentaires et caractères d'espacement.

#### Exemple de conversion

En se basant sur l'alphabet ci-dessus, on pourrait convertir la chaîne de caractère `x = 2 + 2` en une suite de tokens `(x, =, 2, +, 2)` représentant les unités lexicales suivantes :
```js
identifiant : x, 
operateur   : =, 
literal     : 2, 
operateur   : +, 
literal     : 2
```

## Scanner
Le scanner est le programme chargé d'effectuer l'analyse lexicale. Il analyse une chaîne caractère par caractère afin d'en extraire les tokens.

#### Exemple d'extraction de token
```
"ab"
```
- Le scanner démarre l'analyse
- détermine que `"` est un caractère valide pour indiquer le début d'une chaîne de caractères.
- détermine que `a` est un caractère valide dans une chaîne de caractères.
- détermine que `b` est un caractère valide dans une chaîne de caractères.
- détermine que `"` est un caractère valide pour indiquer la fin d'une chaîne de caractères.

Le scanner vient de déterminer que `"ab"` est une chaîne de caractère.

#### Exemple d'analyse de chaîne
```
myVar = 1 @
```
- Le scanner démarre l'analyse.
- détermine que `myVar` est un identifiant.
- ignore l'espace.
- détermine que `=` est un opérateur d'assignement.
- ignore l'espace.
- détermine que `1` est un chiffre.
- ignore l'espace.
- déclenche une erreur `Invalid token '@'` car aucun token ne peut commencer par `@`.

#### Allons nous vraiment devoir développer un outil d'analyse aussi complexe ?

Oui et non.

Nous allons développer un scanner chargé de convertir une chaîne de caractère en une suite de tokens, mais nous n'allons pas développer le programme chargé de résoudre chaque token individuellement. Ce type de programme est ce qu'on appelle **automate fini** (**inite-state automaton** ou **finite-state machine**) et la plupart des langages de haut niveau, dont JavaScript, fournissent déjà un ***regex engine*** ou moteur d'expression rationnelle. Il nous suffira donc de configurer notre scanner avec des expressions rationnelles.

Exemple de configuration et d'utilisation :
```ts
const scanner = new Scanner()

// ignorera les caractères d'espacement
scanner.addSkipToken('T_WHITE_SPACE', /^\s+/)

// extraira les nombres et opérateurs d'addition/substraction
scanner.addToken('T_NUMBER', /^\d+/)
scanner.addToken('T_ADDITIVE', /^[+\-]/)

// initialisation
scanner.init(' 1 + 2 ')

// récupére les tokens un par un
const [type, value] = scanner.nextToken() // T_NUMBER  1
const [type, value] = scanner.nextToken() // T_ADDITIVE +
const [type, value] = scanner.nextToken() // T_NUMBER  2

// ou récupération d'une liste
const [
    [type, value], // T_NUMBER  1
    [type, value], // T_ADDITIVE +    
    [type, value]  // T_NUMBER  2
] = scanner.generateTokenMap(' 1 + 2 ')
```