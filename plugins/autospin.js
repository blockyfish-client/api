// @name Auto spin
// @id autospin
// @description Spin really fast without breaking your arms
// @author pi

plugin.registerKeybind("Spin", "KeyZ");

let mapeditor;
blockyfish.addEventListener("gameInit", () => {
	mapeditor = document.querySelector("#canvas-container > canvas");
});

let spin_direction = 0;
const spin_angle = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];
const spin_radius = 300;

let inter = null;
plugin.onKeybindDown("Spin", () => {
	if (inter != null) return;
	inter = setInterval(() => {
		if (!plugin.isKeybindDown("Spin")) return;
		const spin_coords_x = Math.round(
			spin_radius * Math.sin((Math.PI * 2 * spin_angle[spin_direction]) / 360),
		);
		const spin_coords_y = Math.round(
			spin_radius * Math.cos((Math.PI * 2 * spin_angle[spin_direction]) / 360),
		);
		try {
			mapeditor?.dispatchEvent(
				new MouseEvent("pointermove", {
					clientX: innerWidth / 2 + spin_coords_x,
					clientY: innerHeight / 2 + spin_coords_y,
				}),
			);
			spin_direction = (spin_direction + 1) % 11;
		} catch {}
	}, 15);
});
plugin.onKeybindUp("Spin", () => {
	clearInterval(inter);
	inter = null;
});
