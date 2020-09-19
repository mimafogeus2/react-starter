import babel from '@rollup/plugin-babel'
import clear from 'rollup-plugin-clear'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import filesize from 'rollup-plugin-filesize'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const OUTPUT_DIR = 'dist/'

// This removes the permission/license message injected by tslib to the finalized code.
// That should be okay according to https://github.com/microsoft/tslib/issues/47.
const TERSER_READABLE = terser({
	output: { beautify: true, comments: false },
	keep_fnames: true,
	mangle: false,
	compress: false,
})
const TERSER_MINIFY = terser({ output: { comments: false } })

export default () => [
	{
		input: ['./src/index.ts'],
		output: [
			{
				file: `${OUTPUT_DIR}/main/index.js`,
				format: 'cjs',
				exports: 'named',
				sourcemap: true,
				plugins: [TERSER_READABLE],
			},
			{
				file: `${OUTPUT_DIR}/main/index.min.js`,
				format: 'cjs',
				exports: 'named',
				sourcemap: true,
				plugins: [TERSER_MINIFY],
			},
			{
				file: `${OUTPUT_DIR}/module/index.esm.js`,
				format: 'esm',
				sourcemap: true,
				plugins: [TERSER_READABLE],
			},
			{
				file: `${OUTPUT_DIR}/external/index.min.js`,
				format: 'iife',
				exports: 'named',
				name: 'index',
				sourcemap: true,
				plugins: [TERSER_MINIFY],
			},
		],
		plugins: [
			clear({
				targets: [`${OUTPUT_DIR}main`, `${OUTPUT_DIR}module`, `${OUTPUT_DIR}external`],
				watch: true,
			}),
			peerDepsExternal(),
			typescript({ tsconfig: 'tsconfig.prod.json' }),
			commonjs({ extensions: ['.js', '.ts'] }),
			babel({ babelHelpers: 'bundled' }),
			filesize({ showMinifiedSize: false }),
		],
	},
	{
		input: ['./src/index.ts'],
		output: [{ file: `${OUTPUT_DIR}/main/index.d.ts` }, { file: `${OUTPUT_DIR}/module/index.d.ts` }],
		plugins: [dts()],
	},
]
