plugin.pluginData = {
	name: "I see dead fish!",
	author: "pi & noam",
	description: "Lets you see ghosts",
};

blockyfish.addEventListener("gameInit", ({ game }) => {
	game.currentScene.viewingGhosts = true;
});
