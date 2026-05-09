// @name No Grabber Clamp
// @id nograbberclamp
// @description Makes the camera clamp onto your animal rather than the one grabbing you
// @author moray
// @tags visual, gameplay, client-side

blockyfish.addEventListener("gameInit", ({ game }) => {
	if (!ishooked(game.viewport.moveCenter)) {
		hook(game.viewport, "moveCenter", {
			apply(f, th, args) {
				if (game.currentScene.myAnimals?.[0]._holded) {
					const myPos = game.currentScene.getMyPos();
					return reflect.apply(f, th, [myPos.x, myPos.y]);
				}
				return reflect.apply(f, th, args);
			},
		});
	}
});
