// @name No camera clamp
// @id nocameraclamp
// @description Camera position clamp is removed; your animal will always be centered on the screen
// @author pi and moray
// @tags visual, gameplay, client-side

blockyfish.addEventListener("gameInit", ({ game }) => {
	game.viewport.plugins.remove("clamp");
	hook(game.viewport, "clamp", {
		apply(f, th, args) {
			return;
		},
	});
});
