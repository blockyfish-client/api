const fs = require("node:fs");

const { transformSync } = require("@babel/core");
const { default: presetReact } = require("@babel/preset-react");

const { minify } = require("uglify-js");

const { unified } = require("unified");
const { default: remarkParse } = require("remark-parse");
const { default: remarkGfm } = require("remark-gfm");
const { default: remarkRehype } = require("remark-rehype");
const { default: rehypeSanitize } = require("rehype-sanitize");
const { default: rehypeStringify } = require("rehype-stringify");

// load registry
const reg = JSON.parse(
	fs.readFileSync("registry.json", {
		encoding: "utf8",
	}),
);

// compile announcements
const compileMarkdown = (content) => {
	return unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeSanitize)
		.use(rehypeStringify)
		.processSync(content);
};
const announcements = compileMarkdown(
	fs.readFileSync("announcements.md", { encoding: "utf8" }),
).value;

// add announcements
reg.announcements = announcements;

// minify plugins and write metadata to registry
reg.plugins = [];
const compileJsx = (content) => {
	try {
		const { code } = transformSync(content, {
			presets: [
				[
					presetReact,
					{
						runtime: "classic",
						pure: false,
					},
				],
			],
			comments: false,
			compact: true,
			minified: true,
		});
		return code;
	} catch (err) {
		console.error(err);
	}
};
for (const plugin of fs.readdirSync("plugins")) {
	const content = fs.readFileSync(`plugins/${plugin}`, { encoding: "utf8" });
	const info = content.match(/(?:^\/\/.*$\n?)+/gm).join("\n");
	const babel = compileJsx(content);
	const minified = minify(babel, {
		module: true,
		compress: {
			drop_console: true,
			keep_infinity: true,
			unsafe_math: true,
		},
	}).code;
	fs.writeFileSync(`plugins/${plugin}`, `${info}\n${minified}`);

	// parse metadata
	const matches = info.matchAll(/\/\/ @(?<field>.+?) (?<value>.+)$/gm);
	const metadata = {};
	for (const match of matches) {
		metadata[match.groups.field] = match.groups.value;
	}
	for (const data in reg.pluginsMetadata[metadata.id]) {
		metadata[data] = reg.pluginsMetadata[metadata.id][data];
	}
	reg.plugins.push(metadata);
}

// remove unused pluginMetadata
reg.pluginsMetadata = undefined;

// minify and save registry
fs.writeFileSync("registry.json", JSON.stringify(reg));
