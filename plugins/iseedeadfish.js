// @name I see dead fish!
// @id iseedeadfish
// @description Lets you see ghosts
// @author pi and noam
// @tags visual, client-side

blockyfish.addEventListener("gameInit", ({ game }) => {
	game.currentScene.viewingGhosts = true;
});
