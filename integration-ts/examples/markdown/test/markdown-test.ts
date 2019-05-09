import {launch} from "../../../assert";
import {textTests} from "./text-test";
import {titleTests} from "./title-test";
import {codeBlockTests} from "./code-block-test";
import {bulletsTests} from "./bullet-test";
import {documentTests} from "./document-test";

export function launchMarkdown(): void {

    //
    // launch(titleTests);
    // launch(textTests);
    // launch(codeBlockTests);
     launch(bulletsTests);
    //launch(documentTests);

}
