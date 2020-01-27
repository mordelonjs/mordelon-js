import typescript from 'rollup-plugin-typescript2'
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json'

export default [
    {
        input: 'src/index.ts',
        output: {
            file: pkg.main,
            format: 'umd',
            extend: true,
            name: 'Mordelon',
            globals: {},
        },
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ],
        onwarn: function(warning, warn) {
            if (warning.code === 'CIRCULAR_DEPENDENCY') {
                return;
            }
            warn(warning);
        },
        plugins: [
            typescript({
                useTsconfigDeclarationDir: true,
                typescript: require('typescript'),
            }),
        ],
    },
    {
        input: 'src/index.ts',
        output: {
            file: pkg.module,
            format: 'es',
            globals: {},
        },
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ],
        onwarn: function(warning, warn) {
            if (warning.code === 'CIRCULAR_DEPENDENCY') {
                return;
            }
            warn(warning);
        },
        plugins: [
            typescript({
                useTsconfigDeclarationDir: true,
                typescript: require('typescript'),
            }),
        ],
    },{
        input: 'src/index.ts',
        output:    {
            file: pkg.minify,
            format: 'iife',
            name: 'Mordelon',
        },
        onwarn: function(warning, warn) {
            if (warning.code === 'CIRCULAR_DEPENDENCY') {
                return;
            }
            warn(warning);
        },
        plugins: [
            resolve(),
            commonjs({
                include: 'node_modules/**'
            }),
            typescript({
                useTsconfigDeclarationDir: true,
                typescript: require('typescript'),
            }),
            terser({
                output: {
                    comments: false
                }
            })
        ],
    }
]