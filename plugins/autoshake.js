// @name Auto shake
// @id autoshake
// @description Press the shake keybind to toggle
// @author noam

plugin.registerKeybind("Shake", "KeyV");

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

let held = false;
let inter = null;
plugin.onKeybindDown("Shake", () => {
	if (game == null || game.currentScene == null) return;
	if (held) return;
	held = true;
	if (inter != null) {
		clearInterval(inter);
		inter = null;
		game.currentScene.showMessagePopup(
			"Autoshake has been disabled",
			1000,
			false,
		);
	} else {
		inter = setInterval(() => {
			if (game == null || game.currentScene == null) {
				clearInterval(inter);
				inter = null;
				return;
			}
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
			const incr = FORWARD ? 2000 : 1500;
			const bpos = [
				ppos._x + Math.cos(angleRadians) * incr,
				ppos._y + Math.sin(angleRadians) * incr,
			];
			game.socketManager.sendBytePacket(formMovePacket(bpos[0], bpos[1], 100));
			FORWARD = !FORWARD;
		}, 100);
		game.currentScene.showMessagePopup(
			"Autoshake has been enabled",
			1000,
			false,
		);
	}
});
plugin.onKeybindUp("Shake", () => {
	held = false;
});
