plugin.pluginData = {
	name: "Auto shake",
	description: "Emulate mouse shake when holding shake keybind",
	author: "noam",
};

plugin.registerKeybind("shake", "KeyV");

const formMovePacket = (x, y, idk) => {
	const buf = new ArrayBuffer(10);
	const d = new DataView(buf);
	d.setUint8(0, 2);
	d.setInt32(1, x, true);
	d.setInt32(5, y, true);
	d.setUint8(9, idk);
	return buf;
};

let FORWARD = false;

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});

setInterval(() => {
	if (game == null) return;
	if (!plugin.isKeybindDown("shake")) return;
	if (
		game.currentScene == null ||
		game.currentScene.myAnimal == null ||
		game.inputManager == null ||
		game.inputManager.getMouseWorldPosition == null
	)
		return;
	const mpos = game.inputManager.getMouseWorldPosition();
	const ppos = game.currentScene.myAnimal.position;
	const angleRadians = Math.atan2(mpos.y - ppos._y, mpos.x - ppos._x);
	const incr = FORWARD ? 1000 : 750;
	const bpos = [
		ppos._x + Math.cos(angleRadians) * incr,
		ppos._y + Math.sin(angleRadians) * incr,
	];
	game.socketManager.sendBytePacket(formMovePacket(bpos[0], bpos[1], 100));
	FORWARD = !FORWARD;
}, 100);
