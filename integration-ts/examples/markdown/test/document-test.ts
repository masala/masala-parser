import {markdown} from "../lib/document-parser";
import {assertEquals, assertTrue} from "../../../assert";

const document=`

# Star Wars rocks

This is a nice trilogy

Star Trek rocks also
=====

But more because of the extended universe and games around. *Star Wars* games are less regular.

Good to know
---

* The princess Leia was an important character
* Han Solo is a murderer
    - but it was cleared by technology
* Luke Skywalker is strong     

  a bit of code
    here and there

All these characters were very popular. *Jar Jar Bin* is not.

`;



export const documentTests = {

    'test document': function () {

        const actual = markdown().val(document);

        assertEquals(1, actual.array().filter(md => md.type === 'bulletBlock').length);
        assertEquals(1, actual.array().filter(md => md.type === 'codeBlock').length);
        assertEquals(3, actual.array().filter(md => md.type === 'title').length);
        assertEquals(3, actual.array().filter(md => md.type === 'paragraph').length)
    }

};

