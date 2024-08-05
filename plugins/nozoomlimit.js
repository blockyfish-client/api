// @name No zoom limit
// @id nozoomlimit
// @description Zoom clamp is removed. You can zoom in or out as far as you want
// @author pi

blockyfish.addEventListener("gameInit", ({ game }) => {
	setInterval(function () {
		game.viewport.clampZoom({minWidth: 0, maxWidth: 1e7});
	}, 200);
});
