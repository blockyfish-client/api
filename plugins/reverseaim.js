// @name Reverse aim
// @id reverseaim
// @description Automatically reverses movement on some animals
// @author noam and moray
// @tags gameplay, client-side

let reverse = false;
blockyfish.addEventListener("gameInit", ({ game }) => {
	if (!ishooked(game.inputManager.getMouseWorldPosition)) {
		hook(game.inputManager, "getMouseWorldPosition", {
			apply(f, th, args) {
				if (
					!reverse ||
					game == null ||
					game.currentScene == null ||
					game.currentScene.myAnimals?.[0] == null ||
					game.currentScene.myAnimals?.[0].visibleFishLevel !== 101
				)
					return reflect.apply(f, th, args);
				const pos = reflect.apply(f, th, args);
				const mypos = game.currentScene.getMyPos();
				pos.x = -(pos.x - mypos._x) + mypos._x;
				pos.y = -(pos.y - mypos._y) + mypos._y;
				return pos;
			},
		});
	}
	if (!ishooked(game.currentScene.myAnimal)) {
		hook(game.currentScene, "myAnimals", {
			get(target, prop, receiver) {
				target.forEach((animal) => {
					Object.defineProperty(animal, "_usingSkill", {
						set(val) {
							reverse = val;
						},
						get() {
							return reverse;
						},
					});
				});
				return reflect.get(target, prop, receiver);
			},
		});
	}
});
