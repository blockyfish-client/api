// @name Autofill log-in
// @id loginautofill
// @description Autofills username and password automatically
// @author pi
// @tags utility, client-side

let uval = plugin.storage.get("Autofill Username") || "";
let pval = plugin.storage.get("Autofill Password") || "";

const autofillObserver = new MutationObserver(() => {
	if (
		document.querySelector(
			"#app .vfm .modal__content .el-form-item.is-required:has(.el-input input) + .el-form-item.is-required:has(.el-input input)",
		) == null
	)
		return;
	if (window.location.pathname !== "/login") return;
	console.log("login");

	const uinp = document.querySelector(
		"#app .vfm .modal__content .el-form-item.is-required:nth-child(1) .el-input input",
	);
	const pinp = document.querySelector(
		"#app .vfm .modal__content .el-form-item.is-required:nth-child(2) .el-input input",
	);

	uinp.value = uval;
	uinp.dispatchEvent(new Event("input", { bubbles: true }));
	uinp.oninput = () => {
		if (uval !== uinp.value) {
			uval = uinp.value;
			plugin.storage.set("Autofill Username", uval);
		}
	};
	pinp.value = pval;
	pinp.dispatchEvent(new Event("input", { bubbles: true }));
	pinp.oninput = () => {
		if (uval !== pinp.value) {
			pval = pinp.value;
			plugin.storage.set("Autofill Password", pval);
		}
	};
});
const vfmObserver = new MutationObserver(() => {
	if (!document.querySelector("#app .vfm .modal__content")) return;

	vfmObserver.disconnect();
	autofillObserver.observe(
		document.querySelector("#app .vfm .modal__content"),
		{
			childList: true,
		},
	);
});
vfmObserver.observe(document.querySelector("#app"), {
	childList: true,
	subtree: true,
});
