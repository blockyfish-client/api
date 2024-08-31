// @name Autofill name
// @id autofill
// @description Autofills name automatically
// @author noam

let nameval = plugin.storage.get("Autofill Name") || "";
let inp = document.querySelector(".el-input__wrapper input");

function autofill() {
	inp.value = nameval;
	inp.oninput = () => {
		if (nameval != (nameval = inp.value)) {
			plugin.storage.set("Autofill Name", nameval);
		}
	}
}

if (inp == null) {
	let interval = setInterval(() => {
		inp = document.querySelector(".el-input__wrapper input");
		if (inp != null) {
			clearInterval(interval);
			autofill();
		}
	})
} else {
	autofill();
}
