// @name Custom background
// @id custombackground
// @description Lets you have a custom background image/gif
// @author noam
// @tags visual, theming, client-side

plugin.registerSetting({
	name: "Blur radius",
	type: "number",
	description: "Blur radius, in pixels, to be applied to the wallpaper",
	defaultValue: 0,
});
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
		const blurRadius_ = plugin.getSetting("Blur radius");
		if (!blurRadius_) return;
		const blurRadius = Math.round(blurRadius_);
		if (blurRadius === 0) return;
		homebg.style.setProperty("filter", `blur(${blurRadius}px)`);
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
