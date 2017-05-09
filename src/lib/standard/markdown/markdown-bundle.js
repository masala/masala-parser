import Token from './token';
import Text from './text-parser';
import Title from './title-parser';
import Bullet from './bullet-parser';
import Code from './code-line-parser';

export default {
    blank: Token.blank,
    rawTextUntilChar: Token.rawTextUntilChar,
    eol: Token.eol,
    lineFeed: Token.lineFeed,
    fourSpacesBlock: Token.fourSpacesBlock,
    stop: Text.stop,
    pureText: Text.pureText,
    italic: Text.italic,
    bold: Text.bold,
    code: Text.code,
    text: Text.text,
    formattedSequence: Text.formattedSequence,
    formattedParagraph: Text.formattedParagraph,
    titleLine: Title.titleLine,
    titleSharp: Title.titleSharp,
    title: Title.title,
    bulletLv1: Bullet.bulletLv1,
    bulletLv2: Bullet.bulletLv2,
    bullet: Bullet.bullet,
    codeLine: Code.codeLine,
};
