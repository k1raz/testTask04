import builtinModules from "builtin-modules";
import jetpack from "fs-jetpack";
import fs from "fs-extra";
import path from "path";

import { config } from "dotenv";
import { swc } from "rollup-plugin-swc3";
import { execSync } from "child_process";
import { terser } from "rollup-plugin-terser";
import { blueBright, greenBright, redBright } from "colorette";

import jsonPlugin from "@rollup/plugin-json";
import tsPaths from "rollup-plugin-tsconfig-paths";
import commonjsPlugin from "@rollup/plugin-commonjs";
import typescriptPlugin from "rollup-plugin-typescript2";
import nodeResolvePlugin from "@rollup/plugin-node-resolve";

config({
	path: path.resolve(".env"),
});

const buildOutput = "resources";
const isProduction = process.env.PRODUCTION_MODE === "true";
const useSWC = process.env.COMPILER_USE_SWC === "true";
const sourcePath = path.resolve("src");
const pkgJson = jetpack.read("package.json", "json");
const localInstalledPackages = [...Object.keys(pkgJson.dependencies)];

/**
 * Resolve given path by fs-jetpack
 */
function resolvePath(pathParts) {
	return jetpack.path(...pathParts);
}

/**
 * Generate success console message
 */
function successMessage(message, type = "Success") {
	console.log(`[${greenBright(type)}] ${message}`);
}

/**
 * Generate error console message
 */
function errorMessage(message, type = "Error") {
	console.log(`[${redBright(type)}] ${message}`);
}

/**
 * Copy given source to destination
 */
function copy(source, destination, options = { overwrite: true }) {
	return jetpack.copy(source, destination, options);
}

/**
 * CleanUp the build output
 */
function cleanUp() {}

/**
 * Copy all static files they needed
 */
function copyFiles() {
	const prepareForCopy = [];

	prepareForCopy.push(
		{
			from: jetpack.path("src/client/resource.toml"),
			to: jetpack.path(buildOutput, "client_resources/resource.toml"),
		},
		{
			from: jetpack.path("src/server/resource.toml"),
			to: jetpack.path(buildOutput, "server_resources/resource.toml"),
		},
	);

	prepareForCopy.forEach((item) => {
		copy(item.from, item.to);
		successMessage(blueBright(`${item.from} -> ${item.to}`), "Copied");
	});
}

cleanUp();
copyFiles();

// use terser only if it is the typescript compiler in use
const terserMinify =
	isProduction && !useSWC
		? terser({
				keep_classnames: true,
				keep_fnames: true,
				output: {
					comments: false,
				},
		  })
		: [];

const configTypes = {
	CLIENT: "client",
	SERVER: "server",
};

const generateConfig = (options = {}) => {
	const { type } = options;

	let tsConfigPath = null;
	let outputFile = null;

	switch (type) {
		case configTypes.SERVER: {
			outputFile = resolvePath([buildOutput, "server_resources", "index.js"]);
			tsConfigPath = resolvePath([sourcePath, "server", "tsconfig.json"]);
			break;
		}

		case configTypes.CLIENT: {
			outputFile = resolvePath([buildOutput, "client_resources", "index.js"]);
			tsConfigPath = resolvePath([sourcePath, "client", "tsconfig.json"]);
			break;
		}
	}

	const isServer = type === configTypes.SERVER;

	const serverPlugins = [];
	const plugins = [terserMinify];

	const external = [...builtinModules, ...localInstalledPackages];

	return {
		input: resolvePath([sourcePath, isServer ? "server" : "client", "index.ts"]),
		output: {
			file: outputFile,
			format: isServer ? "cjs" : "esm",
		},
		plugins: [
			tsPaths({ tsConfigPath }),
			nodeResolvePlugin(),
			jsonPlugin(),
			commonjsPlugin(),
			useSWC
				? swc({
						tsconfig: tsConfigPath,
						minify: isProduction,
						jsc: {
							target: "es2020",
							parser: {
								syntax: "typescript",
								dynamicImport: true,
								decorators: true,
							},
							transform: {
								legacyDecorator: true,
								decoratorMetadata: true,
							},
							externalHelpers: true,
							keepClassNames: true,
							loose: true,
						},
				  })
				: typescriptPlugin({
						check: false,
						tsconfig: tsConfigPath,
				  }),
			isServer ? [...serverPlugins] : null,
			...plugins,
		],
		external: isServer ? [...external] : null,
		inlineDynamicImports: true,
	};
};

export default [generateConfig({ type: configTypes.SERVER }), generateConfig({ type: configTypes.CLIENT })];
