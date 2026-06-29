// @name No zoom limit
// @id nozoomlimit
// @description Zoom clamp is removed; you can zoom in or out as far as you want
// @author pi and moray
// @tags visual, gameplay, client-side

blockyfish.addEventListener("gameInit", ({ game }) => {
	game.viewport.clampZoom({ minWidth: 0, maxWidth: 1e6 });
	game.viewport.plugins.remove("clampZoom");
	hook(game.viewport, "clampZoom", {
		apply(f, th, args) {
			return;
		},
	});
});
