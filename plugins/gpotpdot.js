// @name GPO teleport dot
// @id gpotpdot
// @description Adds a dot to indicate GPO teleport location.
// @author hzbakkalgazi
// @tags visual, gameplay, client-side

const radius = 40;
const offsetY = -500;

let currentFishLevel = -1;
const createTeleportDot = () => {
	if (
		typeof game?.currentScene?.myAnimals?.[0]?.visibleFishLevel === "undefined"
	) {
		currentFishLevel = -1;
		return;
	}
	if (game.currentScene.myAnimals?.[0].visibleFishLevel === currentFishLevel)
		return;
	currentFishLevel = game.currentScene.myAnimals?.[0].visibleFishLevel;
	if (currentFishLevel !== blockyfish.Animals.GiantPacificOctopus) return;

	const teleportDot = new PIXI.Graphics();
	teleportDot.beginFill(0xff0000, 0.5);
	teleportDot.drawCircle(0, offsetY, radius);
	teleportDot.endFill();
	game.currentScene.myAnimals?.[0].children[1].addChild(teleportDot);
};

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});

setInterval(() => {
	createTeleportDot();
}, 500);
