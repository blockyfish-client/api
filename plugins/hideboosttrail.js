// @name Hide boost trail
// @id hideboosttrail
// @description Removes boost trail and bubbles
// @author pi
// @tags visual, client-side

let inter;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	const game = _game;
	try {
		clearInterval(inter);
	} catch {}
	inter = setInterval(() => {
		try {
			if (!game?.currentScene?.myAnimal) return;

			hook(
				Object.getPrototypeOf(game.currentScene.myAnimal.fadingTrail),
				"enable",
				{ apply() {} },
			);
			Object.defineProperty(
				Object.getPrototypeOf(game.currentScene.myAnimal.bubblesEmitter),
				"emit",
				{ set: () => {} },
			);
			clearInterval(inter);
		} catch {}
	}, 200);
});
