import { launch } from '../../../assert.js'
import { textTests } from './text-test.js'
import { titleTests } from './title-test.js'
import { codeBlockTests } from './code-block-test.js'
import { bulletsTests } from './bullet-test.js'
import { documentTests } from './document-test.js'

export function launchMarkdown(): void {
    launch(codeBlockTests)
    launch(textTests)
    launch(titleTests)
    launch(bulletsTests)
    launch(documentTests)
}

launchMarkdown()
