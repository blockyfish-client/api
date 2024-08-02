// @name XRAY
// @id xray
// @description See underground cave and animals through terrain
// @author pi and noam

let game;
setInterval(() => {
	try {
		if (game == null || game.currentScene == null) return;
		game.currentScene.ceilingsContainer.alpha = 0.3;
	} catch {}
}, 200);
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
	game.currentScene.foodGlowContainer.zOrder = 996;
	game.currentScene.foodContainer.zOrder = 997;
	game.currentScene.namesLayer.zOrder = 998;
	game.currentScene.animalsContainer.zOrder = 999;
	game.currentScene.barsLayer.zOrder = 1000;
	game.currentScene.chatContainer.zOrder = 1001;
});
