import {markdown} from "../lib/document-parser";

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

All these characters were very popular. *Jar Jar Bin* is not.

`;



export const documentTests = {

    'test document': function () {
        console.log('here');
        const actual = markdown().val(document);
        console.log(JSON.stringify(actual));
    }

};
