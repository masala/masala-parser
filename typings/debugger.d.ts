import { Parser } from '../masala-parser.js'

interface ByNameOption {
    showValue: boolean
}
interface TracerOption {
    showValue: boolean
    byName: Record<string, ByNameOption>
}
interface Tracer {
    trace<D, T>(
        parser: Parser<D, T>,
        name: string,
        opts: TracerOption,
    ): Parser<D, T>

    traceAll
}
