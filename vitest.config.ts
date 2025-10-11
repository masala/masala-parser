// vitest.config.ts  – put next to package.json of @masala/parser
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['src/test/**/*.spec.js'],

        // Vitest looks for ts/tsx by default; turn them off if you like
        includeSource: [],

        coverage: {
            provider: 'v8', // default, but make it explicit
            all: true, // check files not touched by tests, too
            include: ['src/lib/**/*.js'],
            exclude: [
                // never count tests or potential fixtures
                'src/test/**',
                // ignore any build artefacts even if they sneak into src/
                '**/*.d.ts',
                '**/dist/**',
            ],
            thresholds: {
                lines: 100,
            },
            // Thresholds fail if *any* of these drop below the number

            //branches: 100,
            //functions: 100,
            //statements: 100,

            reporter: ['text', 'html'], // CLI + ./coverage/index.html
        },
    },
})
