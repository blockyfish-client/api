// @name Aim line
// @id aimline
// @description Hold down ctrl to show a red aim line on some animals. Requires WebGL to be enabled.
// @author pi

const geometry = new PIXI.Geometry()
	.addAttribute(
		'aVertexPosition',
		[
		//  x,   y
			-2,  0,    // tl
			 2,  0,    // tr
			 2, -1000, // br
			-2, -1000, // bl
		],
		2,
	)
	.addAttribute(
		'aColor',
		[
		//  r, g, b
			1, 0, 0, // tl
			1, 0, 0, // tr
			1, 0, 0, // br
			1, 0, 0, // bl
		],
		3,
	)
	.addAttribute(
		'aAlpha',
		[
			1, // tl
			1, // tr
			0, // br
			0, // bl
		],
		1,
	)
	.addIndex([
		0, 1, 2, // first triangle
		0, 2, 3, // second triangle
	]);

const shader = PIXI.Shader.from(`
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
	`,`
	precision mediump float;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
        gl_FragColor = vec4(vColor, 1.0) * vAlpha;
    }
`);

const includedAnimals = [61, 93, 94, 113];

let currentFishLevel = -1;
let aimLine;
const createAimLine = () => {
	if (typeof game?.currentScene?.myAnimal?.visibleFishLevel === "undefined" ) {
        currentFishLevel = -1;
        return;
    }
    if (game.currentScene.myAnimal.visibleFishLevel === currentFishLevel) return;
	currentFishLevel = game.currentScene.myAnimal.visibleFishLevel;
	if (!includedAnimals.includes(currentFishLevel)) return;

	aimLine = new PIXI.Mesh(geometry, shader);
	game.currentScene.myAnimal.children[1].addChild(aimLine);
	aimLine.renderable = false;
};

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});

setInterval(() => {
	createAimLine();
}, 500)

window.addEventListener(
	"keydown",
	(e) => {
		try {
			if (e.ctrlKey) {
				aimLine.renderable = true;
			}
		} catch { }
	},
	false,
);
window.addEventListener(
	"keyup",
	(e) => {
		try {
			if (!e.ctrlKey) {
				aimLine.renderable = false;
			}
		} catch { }
	},
	false,
);