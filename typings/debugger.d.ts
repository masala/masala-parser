import { Parser } from '../masala-parser.js'

interface ByNameOption {
    showValue: boolean
}
interface TracerOption {
    showValue: boolean
    byName: Record<string, ByNameOption>
}

type ParsingLog = any

interface Tracer {
    trace<D, T>(
        parser: Parser<D, T>,
        name: string,
        opts: TracerOption,
    ): Parser<D, T>

    traceAll
    flush(): ParsingLog[]
    flushForAi(): ParsingLog[]
}

// TO be normalized with simple Tracer
export interface GenlexTracer {
    flush(): ParsingLog[]
    getLastTokenMeta(): any
    flushForAi(): ParsingLog[]
}
