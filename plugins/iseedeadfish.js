// @name I see dead fish!
// @id iseedeadfish
// @description Lets you see ghosts
// @author pi and noam

blockyfish.addEventListener("gameInit", ({ game }) => {
	game.currentScene.viewingGhosts = true;
});
