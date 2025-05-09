// @name No invisible animals
// @id noinvisibleanimals
// @description Makes invisible animals visible
// @author pi and noam
// @tags visual, gameplay, client-side

const AIs = [18, 29, 44, 47, 52, 67, 77, 88, 118];

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});

setInterval(() => {
	try {
		if (game == null || game.currentScene == null) return;
		for (const animal of game.currentScene.entityManager.animalsList) {
			if (animal.alpha < 0.5) {
				animal.alpha = 0.5;
			}
			if (animal.inner.alpha < 0.5) {
				animal.inner.alpha = 0.5;
			}
			if (animal.relatedObjects.visible !== true) {
				animal.relatedObjects.visible = true;
			}

			// the following tweaks shouldn't apply to AIs
			if (animal.visibleFishLevel) continue;
			if (animal.nameObject.visible !== true) {
				animal.nameObject.visible = true;
			}
		}
	} catch {}
}, 50);
