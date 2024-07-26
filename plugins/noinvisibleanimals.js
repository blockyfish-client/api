plugin.pluginData = {
    name: "No invisible animals",
    description: "Makes invisible animals visible",
    author: "pi & noam"
};

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
    game = _game;
});

setInterval(() => {
    try {
        if (game == null || game.currentScene == null) return;
        for (let i = 0; i < game.currentScene.entityManager.animalsList.length; i++) {
            if (game.currentScene.entityManager.animalsList[i].alpha < 0.5) {
                game.currentScene.entityManager.animalsList[i].alpha = 0.5;
            }
            if (game.currentScene.entityManager.animalsList[i].inner.alpha < 0.5) {
                game.currentScene.entityManager.animalsList[i].inner.alpha = 0.5;
            }
            if (game.currentScene.entityManager.animalsList[i].relatedObjects.visible != true) {
                game.currentScene.entityManager.animalsList[i].relatedObjects.visible = true;
            }
            if (game.currentScene.entityManager.animalsList[i].nameObject.visible != true) {
                game.currentScene.entityManager.animalsList[i].nameObject.visible = true;
            }
        }
    } catch { }
}, 25);