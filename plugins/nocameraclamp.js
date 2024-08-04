// @name No camera clamp
// @id nocameraclamp
// @description Camera position clamp is removed; your animal will always be centered on the screen
// @author pi

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});

setInterval(() => {
	try {
		game.viewport.plugins.plugins.clamp = null;
		game.viewport.plugins.plugins["clamp-zoom"] = null;
	} catch {}
}, 200);
