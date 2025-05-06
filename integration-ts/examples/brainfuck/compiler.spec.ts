import {C, F, GenLex, SingleParser, Streams, tuple, TupleParser, Tuple} from "@masala/parser";
import { describe, it, expect } from 'vitest';


const genlex = new GenLex();
genlex.setSeparatorsParser(F.not(C.charIn('+-<>[],.')));
const [plus, minus, lt, gt, open, close, comma, period] = genlex.keywords(['+', '-', '<', '>', '[', ']', ',', '.']);

const MEMORY_SIZE = 30000;
const memory = new Array(MEMORY_SIZE).fill(0);


// Memory pointer (Points to a cell in MEMORY)
let pointer = 0;

let executed = '';
let max = 0;
let input = "";
let output = "";


interface Instruction {
    type: string;
}

interface Loop extends Instruction {
    values: Instruction[]
}

function terminal(): TupleParser<Instruction> {

    return plus.or(minus).or(lt).or(gt).or(comma).or(period)
        .map(type => ({type}))
        .rep();
}

function loopExpr(): SingleParser<Loop> {
    return open.drop().then(F.lazy(expr)).then(close.drop())
        .array()
        .map(values => {
            return {
                type: 'loop',
                values: [...values]
            }
        });
}


function expr(): TupleParser<Instruction> {
    //TODO: typing error
    return terminal().then(
        subExpr().opt().map(option => option.isPresent() ? option.get() : tuple())
    )
}

function subExpr(): TupleParser<Instruction> {
    return loopExpr().then(
        F.lazy(expr).opt().map(option => option.isPresent() ? option.get() : tuple())
    )
}


export function createParser() {

    const grammar = expr();
    return genlex.use(grammar);
}


// from https://gist.github.com/shawnmcla/
function brainfuck(program: string) {

    resetState();

    const parser = createParser();

    let response = parser.parse(Streams.ofString(program));

    interpretAll(response.value.array());

    console.log({memory: memory.slice(0, max + 1), output, executed});

    console.log('\n\n\n\n');

}

function interpretAll(instructions: Instruction[]) {

    instructions.forEach(interpret)

}


function interpret(instruction: Instruction) {

    switch (instruction.type) {
        case '>':
            if (pointer == max) {
                max++; // we need one more cell
            }
            pointer++;
            break;
        case '<':
            pointer--;
            break;
        case '+':
            memory[pointer]++;
            break;
        case '-':
            memory[pointer]--;
            break;
        case '.':
            sendOutput(memory[pointer]);
            break;
        case ',':
            memory[pointer] = getInput();
            break;
        case 'loop':
            while (memory[pointer] !== 0) {
                executed += " " + instruction.type;
                let loop = instruction as Loop;
                interpretAll(loop.values);
            }
            break;
        default: // We ignore any character that are not part of regular Brainfuck syntax
            break;

    }
    if (instruction.type !== 'loop') {
        executed += " " + instruction.type;
    }
}

function resetState() {
    console.log('----- new brainfuck ------ \n\n  ');
    // Clear memory, reset pointers to zero.
    memory.fill(0);
    max = 0;
    pointer = 0;
    output = "";
    input = "";
    executed = "";
}


function sendOutput(value: number) {
    output += String.fromCharCode(value);
}

function getInput() {
    return 42;
}

describe('Brainfuck Interpreter', () => {

    it('should handle simple increment and move', () => {
        const program = '+++>+';
        resetState();
        const parser = createParser();
        let response = parser.parse(Streams.ofString(program));
        interpretAll(response.value.array());

        expect(memory.slice(0, max + 1)).toEqual([3, 1]);
        expect(output).toBe('');
        expect(pointer).toBe(1);
    });

    it('should handle a simple loop for swap', () => {
        const program = '+++[>+<-]';
        resetState();
        const parser = createParser();
        let response = parser.parse(Streams.ofString(program));
        interpretAll(response.value.array());

        // Memory: [0, 3] (values swapped), Pointer: 0
        expect(memory.slice(0, max + 1)).toEqual([0, 3]);
        expect(output).toBe('');
        expect(pointer).toBe(0);
    });

    it('should print \"Hello World!\\n\"' , () => {
        // Hello World program from https://esolangs.org/wiki/Brainfuck#Hello,_World!
        const program = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';
        resetState();
        const parser = createParser();
        let response = parser.parse(Streams.ofString(program));
        interpretAll(response.value.array());

        expect(output).toBe('Hello World!\n');
        // Memory state check might be complex, focusing on output
    });

    // Add more tests for comma, period, edge cases etc.
});


/* Original direct calls - commented out
//simple test
brainfuck('+++>+');


//swap 0,1 values
brainfuck('+++[>+<-]');

let hW = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';
brainfuck(hW);
*/
