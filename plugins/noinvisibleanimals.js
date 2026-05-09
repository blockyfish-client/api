// @name No invisible animals
// @id noinvisibleanimals
// @description Makes invisible animals visible
// @author pi, noam, and moray
// @tags visual, gameplay, client-side

const AIs = [18, 29, 44, 47, 52, 67, 77, 88, 118];

blockyfish.addEventListener("gameInit", ({ game }) => {
	hook(game.currentScene.entityManager, "getEntity", {
		apply(f, th, args) {
			const animal = reflect.apply(f, th, args);

			if (!animal || animal.type !== 1) return animal;

			if (animal.alpha < 0.5) animal.alpha = 0.5;
			if (animal.inner.alpha < 0.5) animal.inner.alpha = 0.5;
			if (animal.relatedObjects.visible !== true)
				animal.relatedObjects.visible = true;
			if (AIs.includes(animal.fishLevelData.fishLevel)) return animal;
			if (animal.nameObject.visible !== true) animal.nameObject.visible = true;

			return animal;
		},
	});
});
