// @name Custom background
// @id custombackground
// @description Lets you have a custom background image/gif
// @author noam
// @tags visual, theming, client-side

plugin.registerSetting({
	name: "URL",
	type: "string",
	description: "URL to custom background image/gif",
	defaultValue: "",
});

const url = plugin.getSetting("URL").trim();
if (url !== "") {
	let homebg = document.querySelector(".home-bg");
	const onhomebg = () => {
		homebg.style.setProperty("background-image", `url("${url}")`, "important");
	};
	if (homebg == null) {
		const interval = setInterval(() => {
			homebg = document.querySelector(".home-bg");
			if (homebg != null) clearInterval(interval);
			onhomebg();
		});
	} else {
		onhomebg();
	}
}
