export interface MdElement {
    type: string
}

export interface MdText extends MdElement{
    text: string
}


export interface MdTitle extends MdElement{
    level: number,
    typeOption:any,
    text: string
}

export type FormattedSequence = MdText[];


export interface CodeLine extends MdElement{
    content:string;
}

export interface CodeBlock extends MdElement{
    lines:string[]
}
