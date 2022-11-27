# Définition et structure d'un langage de programmation

## Qu'est-ce qu'un langage ?
Un langage est une suite de **mots**, un **mot** est une suite de **symboles** appartenant à un **alphabet**. 

Définissons chaque terme plus précisément :

- **Alphabet** : ensemble fini *non-vide* (possèdant au moins un élément) de symboles

- **Mot** : suite finie d'éléments d'un alphabet

- **Langage** : ensemble de mots définis sur un alphabet

> Attention, un symbole n'est pas forcément formé d'un seul caractère.

Exemples de mots :

- On peut former le mot `bac` depuis l'alphabet `Σ = { a, b, c }`

- On peut former le mot `if (true) print("true");` depuis l'alphabet `Σ = { (, ), ;, ", if, true, print,  }`

## Langage naturel vs formel
Les termes définis précédemment n'ont pas la même signification lorsque l'on parle de **langages naturels** (parlé par les êtres humains).
On parlera de **phrases** plutôt que de **mots** et de **vocabulaire** plutôt que d'**alphabet**.

On dira donc qu'on peut former la **phrase** `le chien aboie` depuis le **vocabulaire** `{aboie, chien, le}`.

À la différence des langages naturels, les langages de programmation doivent être formalisés, explicites afin d'être interprétés, exécutés. Un langage de programmation est donc un **langage formel**.

Je suis conscient que ces notions peuvent être sujet à confusion et à vrai dire, j'aurais pu ne jamais écrire à ce sujet que vous auriez toujours été en mesure de comprendre ce livre. Je pense néanmoins qu'il est important que vous sachiez qu'il existe une réflexion scientifique derrière la notion de langage, libre à vous de l'étudier *(cf. bibliographie)*.

## Compilation vs interprétation

Un langage dit interprété est un langage dont le code source est exécuté par un logiciel tiers appelé **moteur** ou **interpréteur**. Ce logiciel est souvent écrit dans un langage dit compilé, par exemple le moteur v8 de chrome est écris en c++ [[1]](#src-1). Les concepts théoriques qui sous-tendent l'implémentation des langages interprétés sont souvent inspirés, voire identiques aux étapes de la compilation, c'est pourquoi il est intéressant de commencer par comprendre ce qu'est une compilation, même superficiellement.

Lors de votre apprentissage, vous avez peut-être appris que la compilation consiste à transformer un langage source en instructions exécutables. Il est vrai que ce type de transformation est un processus de compilation, mais sa définition générale décrit la transformation d'un langage A en un langage B. On dit que le compilateur transforme un code source en un **code objet** (ou cible)[[2]](#src-2).

Par exemple, dans ce livre, nous allons utiliser **TypeScript**, qui est un langage compilé. En effet, le compilateur de Typescript va analyser le code source, procéder à une analyse sémantique (principalement la vérification des types) et le compiler en **Javascript**. Ce type de compilateur est aussi appelé **source-to-source compiler**, **transcompiler** ou **transpiler** en référence au niveau d'abstraction similaire entre le code source et le code objet, mais l'utilisation de ces termes est parfois sujet à débat [[3]](#src-3). Par ailleurs, notez que beaucoup des documentations officielles de ces outils emploient le terme *compilateur* pour les définir[[4]](#src-4) 
[[5]](#src-5). Ces détails sémantiques n'ont pas telllement d'importance, mais je préfère prévenir toute confusion en amont. 

### Étapes de la compilation

Le processus de compilation est généralement décomposé en plusieurs étapes, par exemple :

- **L'analyse lexicale** est l'étape de segmentations du code en tokens : `const x = 4` -> `{const, x, =, 4}`
    
    
- **L'analyse syntaxique** est l'étape de structuration du programme :
. Par exemple, `if (;` est validée par l'analyseur lexical, mais sa syntaxe est invalide. Autre exemple, cet suite de tokens `{1, +, 2, /, 3}` est valide mais faut-il commencer par résoudre l'addition ou la division ?


- **L'analyse sémantique** vérifie que notre programme a du sens :
```c
int add(int a, int b)
{
    return a + b;
}

int main()
{
    add(2); // error: too few arguments to function ‘add’

    return 0;
}
```

- Il peut également y avoir une étape de **prétraitement** ou **preprocessing** en anglais, par exemple le traitement des **macros** en c/c++ [[6]](#src-6)

- La génération et l'optimisation de **code intermédiaire**

- Pour terminer, la génération du code objet
‌

Dans ce livre, nous nous intéresserons particulièrement aux étapes d'analyse lexicale, syntaxique et sémantique.
<br>
<br>

### Notes et références

- Solnon Christine. “Théorie Des Langages.” Perso.liris.cnrs.fr, http://perso.citi-lab.fr/csolnon/langages.pdf. Accessed 23 June 2022.

- Demaille Akim et François Yvon. “Théorie des Langages.” lrde.epita.fr, 26 Septembre 2016, https://www.lrde.epita.fr/~akim/thl/lecture-notes/theorie-des-langages-2.pdf. Accessed 18 June 2022.

---

- <a name="src-1">1.</a> 
“V8 JavaScript Engine.” V8.Dev, https://v8.dev/. Accessed 18 June 2022.
‌
- <a name="src-2">2.</a>
Beal Vangie. “What Is Object Code?” Webopedia, 1 Sept. 1996, https://www.webopedia.com/definitions/object-code/. Accessed 18 June 2022.

- <a name="src-3">3.</a>
“Compiler Construction - Compiling vs Transpiling.” Stack Overflow, https://stackoverflow.com/questions/44931479/compiling-vs-transpiling. Accessed 18 June 2022.
‌
- <a name="src-4">4.</a>
“Babel · the Compiler for next Generation JavaScript.” Babeljs.io, https://babeljs.io/. Accessed 18 June 2022.

- <a name="src-5">5.</a>
“Documentation - the Basics, *Tsc , the TypeScript Compiler*.” typescriptlang.org, https://www.typescriptlang.org/docs/handbook/2/basic-types.html#tsc-the-typescript-compiler. Accessed 18 June 2022.

- <a name="src-6">6.</a>
“Preprocessor - Cppreference.com.” En.cppreference.com, https://en.cppreference.com/w/cpp/preprocessor. Accessed 23 June 2022.
‌