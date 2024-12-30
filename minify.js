const fs = require("node:fs");
const { transformSync } = require("@babel/core");
const { default: presetReact } = require("@babel/preset-react");

// minify registry
fs.writeFileSync(
	"registry.json",
	JSON.stringify(
		JSON.parse(
			fs.readFileSync("registry.json", {
				encoding: "utf8",
			}),
		),
	),
);

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

// minify plugins
for (const plugin of fs.readdirSync("plugins")) {
	const content = fs.readFileSync(`plugins/${plugin}`, { encoding: "utf8" });
	const info = content.match(/(?:^\/\/.*$\n?)+/gm).join("\n");
	fs.writeFileSync(`plugins/${plugin}`, `${info}\n${compileJsx(content)}`);
}
