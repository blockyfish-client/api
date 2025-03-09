// @name Black
// @id pearsaehify
// @description Lose all your rights and start getting a taste for koolaid kfc and watermelon
// @author noam
// @tags visual, theming, client-side

let game;

blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});

setInterval(() => {
	if (game?.currentScene?.entityManager?.animalsList == null) return;
	const animalsList = game.currentScene.entityManager.animalsList;
	for (let i = 0; i < animalsList.length; i++) {
		const animal = animalsList[i];
		const sprite = animal?.sprite;
		if (sprite != null) {
			sprite._tintRGB =
				sprite._cachedTint =
				sprite._tintColor._int =
				sprite._tintColor._value =
					0x001c3e; // brown
		}
	}
});
