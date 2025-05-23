import { describe, it, expect } from 'vitest';
import { GenLex } from '../../lib/genlex/genlex';
import { F, C } from '../../lib/parsec/index'; // Added .js extension
import Streams from "../../lib/stream";

function createParser(){
    const genlex = new GenLex();
    genlex.setSeparatorsParser(F.not(C.charIn('+-<>[],.')));
    // Define tokens for each Brainfuck command
    genlex.keywords(['+', '-', '<', '>', '[', ']', ',', '.']);
    // The grammar will collect all recognized tokens
    const grammar = F.any().map(token => token.value).rep(); 
    return genlex.use(grammar);
}

describe('GenLex Brainfuck Tokenizer Tests', () => {

    it('parser is valid', () => {
        let hW = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';
        let parser = createParser();
        const response = parser.parse(Streams.ofString(hW));

        expect(response.isAccepted()).toBe(true);
        // Check if all characters that are commands were tokenized
        // The original test's response.offset was the count of actual Brainfuck command characters.
        const actualBfChars = hW.split('').filter(char => '+-<>[],.'.includes(char)).length;
        expect(response.value.size()).toBe(actualBfChars);
        // The GenLex offset would be the number of tokens found.
        expect(response.offset).toBe(actualBfChars);
    });

    it('comments are accepted', () => {
        let hW = `++++++++               Set Cell #0 to 8
[
    >++++               Add 4 to Cell #1; this will always set Cell #1 to 4
    [                   as the cell will be cleared by the loop
        >++             Add 2 to Cell #2
        >+++            Add 3 to Cell #3
        >+++            Add 3 to Cell #4
        >+              Add 1 to Cell #5
        <<<<-           Decrement the loop counter in Cell #1
    ]                   Loop till Cell #1 is zero; number of iterations is 4
    >+                  Add 1 to Cell #2
    >+                  Add 1 to Cell #3
    >-                  Subtract 1 from Cell #4
    >>+                 Add 1 to Cell #6
    [<]                 Move back to the first zero cell you find; this will
                        be Cell #1 which was cleared by the previous loop
    <-                  Decrement the loop Counter in Cell #0
]                       Loop till Cell #0 is zero; number of iterations is 8

Cell No :   0   1   2   3   4   5   6
Contents:   0   0  72 104  88  32   8
Pointer :   ^

>>.                     Cell #2 has value 72 which is 'H'
>---.                   Subtract 3 from Cell #3 to get 101 which is 'e'
+++++++..+++.           Likewise for 'llo' from Cell #3
>>.                     Cell #5 is 32 for the space
<-.                     Subtract 1 from Cell #4 for 87 to give a 'W'
<.                      Cell #3 was set to 'o' from the end of 'Hello'
+++.------.--------.    Cell #3 for 'rl' and 'd'
>>+.                    Add 1 to Cell #5 gives us an exclamation point
>++.                    And finally a newline from Cell #6`;

        let parser = createParser();
        const response = parser.parse(Streams.ofString(hW));

        expect(response.isAccepted()).toBe(true);
        // The original test asserted offset 106. This is the count of actual Brainfuck command characters.
        const bfCommandCharsInString = hW.split('').filter(char => '+-<>[],.'.includes(char)).length;
        // response.offset should be the number of tokens (bfCommandCharsInString)
        expect(response.offset).toBe(bfCommandCharsInString);
        expect(response.value.size()).toBe(bfCommandCharsInString);
        expect(bfCommandCharsInString).toBe(106); // Validating the count itself based on original test
    });
}); 