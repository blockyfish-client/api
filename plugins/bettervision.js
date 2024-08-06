// @name Better vision
// @id bettervision
// @description No ink flash or deep darkness effects
// @author pi and noam

blockyfish.addEventListener("gameInit", ({ game }) => {
	game.currentScene.setFlash = () => {}; // who tf changed this
	game.currentScene.terrainManager.shadow.setShadowSize(1000000);
	game.currentScene.terrainManager.shadow.setShadowSize = () => {};
});
