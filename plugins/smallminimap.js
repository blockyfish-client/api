// @name Small minimap
// @id smallminimap
// @description Halves the size of the in-game minimap
// @author Pi
// @tags visual, theming, client-side

let game;

blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;

	game.currentScene.minimap.scale.set(0.5);
	game.currentScene.minimap.pivot.set(-70, -45);
});
