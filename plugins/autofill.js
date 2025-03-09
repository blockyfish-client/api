// @name Autofill name
// @id autofill
// @description Autofills name automatically
// @author noam
// @tags utility, client-side

let nameval = plugin.storage.get("Autofill Name") || "";
let inp = document.querySelector(".name-input input");

let x = false;
function autofill() {
	if (x) return;
	x = true;

	inp.value = nameval;
	inp.dispatchEvent(new Event("input", { bubbles: true }));
	inp.oninput = () => {
		if (nameval !== inp.value) {
			nameval = inp.value;
			plugin.storage.set("Autofill Name", nameval);
		}
	};
}

let interval;
if (inp == null) {
	interval = setInterval(() => {
		inp = document.querySelector(".name-input input");
		if (inp != null) {
			clearInterval(interval);
			autofill();
		}
	}, 200);
} else {
	autofill();
}
