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
			if (!game?.currentScene?.myAnimals?.[0]) return;

			hook(
				Object.getPrototypeOf(game.currentScene.myAnimals?.[0].fadingTrail),
				"enable",
				{ apply() {} },
			);
			Object.defineProperty(
				Object.getPrototypeOf(game.currentScene.myAnimals?.[0].bubblesEmitter),
				"emit",
				{ set: () => {} },
			);
			clearInterval(inter);
		} catch {}
	}, 200);
});
