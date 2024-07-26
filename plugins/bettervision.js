plugin.pluginData = {
    name: "Better vision",
    description: "No ink flash or deep darkness effects",
    author: "pi & noam"
};

blockyfish.addEventListener("gameInit", ({ game }) => {
    game.currentScene.toggleFlash = function () { };
    game.currentScene.terrainManager.shadow.setShadowSize(1000000);
    game.currentScene.terrainManager.shadow.setShadowSize = function () { };
});