// @name Quick disconnect
// @id quickdisconnect
// @description Press Ctrl + Shift + Q to disconnect from any server
// @author pi


plugin.registerKeybind("Disconnect", "KeyQ");

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});

document.addEventListener("keydown", (e) => {
	if (e.code === plugin.getKeybind("Disconnect") && e.ctrlKey && e.shiftKey)
		game.socketManager.disconnect();
});
