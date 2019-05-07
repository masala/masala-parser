import {launch} from "../../../assert";
import {textTests} from "./text-test";
import {titleTests} from "./title-test";

export function launchMarkdown(){

    launch(titleTests);
    launch(textTests);

}