import {launch} from "../../../assert";
import {textTests} from "./text-test";
import {titleTests} from "./title-test";
import {codeBlockTests} from "./code-block-test";

export function launchMarkdown(){

    /*launch(titleTests);
    launch(textTests);*/
    launch(codeBlockTests);

}