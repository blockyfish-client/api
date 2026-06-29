// @name Aim line
// @id aimline
// @description Hold down ctrl/cmd to show a red aim line on some animals. Requires WebGL to be enabled.
// @author pi
// @tags visual, gameplay, client-side

const geometry = new PIXI.Geometry()
	.addAttribute(
		"aVertexPosition",
		[
			// tl: x y
			-2, 0,

			// tr: x y
			2, 0,

			// br: x y
			2, -1000,

			// bl: x y
			-2, -1000,
		],
		2,
	)
	.addAttribute(
		"aColor",
		[
			// tl: r g b
			1, 0, 0,

			// tr: r g b
			1, 0, 0,

			// br: r g b
			1, 0, 0,

			// bl: r g b
			1, 0, 0,
		],
		3,
	)
	.addAttribute(
		"aAlpha",
		[
			// tl tr br bl
			1, 1, 0, 0,
		],
		1,
	)
	.addIndex([
		// first triangle
		0, 1, 2,

		// second triangle
		0, 2, 3,
	]);

const shader = PIXI.Shader.from(
	`
    precision mediump float;
    attribute vec2 aVertexPosition;
    attribute vec3 aColor;
    attribute float aAlpha; 

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
        vColor = aColor;
        vAlpha = aAlpha;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }
	`,
	`
	precision mediump float;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
        gl_FragColor = vec4(vColor, 1.0) * vAlpha;
    }
`,
);

const { Animals } = blockyfish;
const includedAnimals = [
	Animals.Archerfish,
	Animals.BeakedWhale,
	Animals.GoblinShark,
	Animals.PolarBear,
	Animals.SeaOtter,
];

let currentFishLevel = -1;
let aimLine;
const createAimLine = () => {
	if (
		typeof game?.currentScene?.myAnimals?.[0]?.visibleFishLevel === "undefined"
	) {
		currentFishLevel = -1;
		return;
	}
	if (game.currentScene.myAnimals?.[0].visibleFishLevel === currentFishLevel)
		return;
	currentFishLevel = game.currentScene.myAnimals?.[0].visibleFishLevel;
	if (!includedAnimals.includes(currentFishLevel)) return;

	aimLine = new PIXI.Mesh(geometry, shader);
	game.currentScene.myAnimals?.[0].children[1].addChild(aimLine);
	aimLine.renderable = false;
};

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});

setInterval(() => {
	createAimLine();
}, 500);

window.addEventListener(
	"keydown",
	(e) => {
		try {
			if (e.ctrlKey || e.metaKey) {
				aimLine.renderable = true;
			}
		} catch {}
	},
	false,
);
window.addEventListener(
	"keyup",
	(e) => {
		try {
			if (!e.ctrlKey && !e.metaKey) {
				aimLine.renderable = false;
			}
		} catch {}
	},
	false,
);
