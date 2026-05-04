// @name Better vision
// @id bettervision
// @description No ink flash or deep darkness effects
// @author pi and noam
// @tags visual, gameplay, client-side

blockyfish.addEventListener("gameInit", ({ game }) => {
	game.currentScene.setFlash = () => {};
	game.currentScene.toggleFlash = () => {};
	game.currentScene.terrainManager.shadow.setShadowSize(1000000);
	game.currentScene.terrainManager.shadow.setShadowSize = () => {};
});
