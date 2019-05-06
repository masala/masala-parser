export type MdBold ={bold: string};
export type MdItalic ={italic: string};
export type MdCode ={code: string};
export type MdText ={text: string};

export type MdElement= MdText|MdBold|MdItalic|MdCode;

export type FormattedSequence = MdElement[];

