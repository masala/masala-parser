export interface HasTypeOption<O>{
    typeOption:O
}

export interface MdElement {
    type: string
}

export interface MdText extends MdElement{
    text: string
}


export interface MdTitle extends MdElement, HasTypeOption<string>{
    level: number,
    text: string
}

export type FormattedSequence = MdText[];


export interface Paragraph extends MdElement{
    content: FormattedSequence;
}

export interface CodeLine extends MdElement{
    content:string;
}

export interface CodeBlock extends MdElement{
    lines:string[]
}

export interface Bullet extends MdElement{
    level:number;
    content: FormattedSequence
}

export interface BulletLevel2 extends Bullet{
}

export interface BulletLevel1 extends Bullet{
    children : BulletLevel2[]
}