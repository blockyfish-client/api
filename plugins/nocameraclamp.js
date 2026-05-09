// @name No camera clamp
// @id nocameraclamp
// @description Camera position clamp is removed; your animal will always be centered on the screen
// @author pi and moray
// @tags visual, gameplay, client-side

blockyfish.addEventListener("gameInit", ({ game }) => {
	Object.defineProperty(game.viewport.plugins.plugins, "clamp-zoom", {
		set: function () {
			this._clampZoom = null;
		},
		get: function () {
			return this._clampZoom;
		},
	});

	Object.defineProperty(game.viewport.plugins.plugins, "clamp", {
		set: function () {
			this._clampZoom = null;
		},
		get: function () {
			return this._clampZoom;
		},
	});
});
