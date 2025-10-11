export function aiConvert(logs) {
    const keysToKeep = ['type', 'name', 'expected', 'found', 'snippet']
    const acceptedTypes = [
        'grammar-accept',
        'grammar-reject',
        'grammar-eos',
        'lex-taken',
        'lex-try',
        'lex-fail',
    ]
    let newLogs = keepOnlyKeys(logs, keysToKeep)
    newLogs = keepLogByType(newLogs, acceptedTypes)

    const simplified = simplify(newLogs)
    return simplified
}

function keepOnlyKeys(logs, keys) {
    return logs.map((log) => {
        const newLog = {}
        for (const key of keys) {
            if (key in log) {
                newLog[key] = log[key]
            }
        }
        return newLog
    })
}

function keepLogByType(logs, types) {
    return logs.filter((log) => types.includes(log.type))
}

// Append or start a { lexTried: [...] } group
function pushLexTried(out, name) {
    const last = out[out.length - 1]
    if (last && Array.isArray(last.lexTried)) {
        last.lexTried.push(name)
    } else {
        out.push({ lexTried: [name] })
    }
}

// Append or start a { grammarRejected: [...] } group
function pushGrammarRejected(out, expected) {
    const last = out[out.length - 1]
    if (last && Array.isArray(last.grammarRejected)) {
        last.grammarRejected.push(expected)
    } else {
        out.push({ grammarRejected: [expected] })
    }
}

// Full pass over raw events -> simplified log
function simplify(events) {
    const out = []
    for (const ev of events) {
        if (ev.type === 'lex-try') {
            pushLexTried(out, ev.name)
        } else if (ev.type === 'grammar-reject') {
            pushGrammarRejected(out, ev.expected)
        } else {
            // keep other events as-is (e.g., lex-taken, grammar-accept, lex-fail)
            out.push(ev)
        }
    }
    return out
}
