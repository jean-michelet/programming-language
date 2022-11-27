import Interpreter from "./interpreter/Interpreter"
import createLexer from "./parsing/createLexer"
import SParser from "./parsing/SParser"

const stringify = require('@aitodotai/json-stringify-pretty-compact')

const src = `
class Post {
    fn construct() {
        
    }

    fn sayHello() {
        log("hello");
    }
}

const post = new Post();
post.sayHello();
`
const parser = new SParser(createLexer())
const ast = parser.parse(src)

const interpreter = new Interpreter()
interpreter.eval(ast)