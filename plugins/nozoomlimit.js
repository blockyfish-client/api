// @name No zoom limit
// @id nozoomlimit
// @description Zoom clamp is removed. You can zoom in or out as far as you want
// @author pi
// @tags visual, gameplay, client-side

blockyfish.addEventListener("gameInit", ({ game }) => {
	const inter = setInterval(() => {
		if (game.currentScene == null) return clearInterval(inter);
		game.viewport.clampZoom({ minWidth: 0, maxWidth: 1e7 });
	}, 200);
});
