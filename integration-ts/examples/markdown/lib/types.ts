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


