

Letters
=====


Objectives:

* Ascii letters
* European letters : default
* UTF-8 letters
* + Emojis




/^[A-Za-z\u00C0-\u017F]+$/








var testString = 'áüñ÷ArEœÿ';
var test1 = /^\w+$/;
var test2 = /^[a-z]+$/;
var test3 = /^[a-zA-Z\u00C0-\u017F]+$/;

document.getElementById("test1").innerHTML = (test1.test(testString)) ? 'YES' : 'NO';

document.getElementById("test2").innerHTML = (test2.test(testString)) ? 'YES' : 'NO';

document.getElementById("test3").innerHTML = (test3.test(testString)) ? 'YES' : 'NO';

StackOverflow Regex
https://stackoverflow.com/questions/5436824/matching-accented-characters-with-javascript-regexes

>>>> Make a response with next Masala version

UTF8 chars:
http://csbruce.com/software/utf-8.html

Codepen validation:
https://codepen.io/nicorama/pen/aLjJZb