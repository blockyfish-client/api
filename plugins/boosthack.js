// @name Instant charged boost
// @id boosthack
// @description ctrl/cmd + click for full boost, alt + click for half boost, and ctrl/cmd + shift + click for super jump/coco combo/thresher super boost
// @author pi
// @tags gameplay, server-side

let overlayRef = null;

const createOverlay = () => {
	try {
		overlayRef?.parentElement?.remove();
	} catch {}

	overlayRef = null;
	const overlay = document.createElement("div");
	document.querySelector("div.game").prepend(overlay);
	ReactDOM.createRoot(overlay).render(
		<div
			ref={(el) => {
				overlayRef = el;
			}}
			style={{
				width: "100%",
				height: "100%",
				position: "absolute",
				display: "block",
				zIndex: 10000,
				pointerEvents: "none",
				userSelect: "none",
			}}
		/>,
	);
};

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
	createOverlay();
});

const showCtrlOverlay = () => {
	try {
		if (game?.currentScene?.myAnimals?.[0] && overlayRef) {
			overlayRef.style.pointerEvents = "all";
		}
	} catch {}
};

let ctrlKey = false;
let altKey = false;
let shiftKey = false;

let lastBoost = 0;
const boostCooldown = 250;

const executeBoost = () => {
	if (game?.currentScene?.myAnimals?.[0] == null) return;

	const { BeakedWhale, BelugaWhale, CoconutCrab, ThresherShark, Shark } =
		blockyfish.Animals;
	const lvl = game.currentScene.myAnimals?.[0]._visibleFishLevel;
	try {
		// alt
		if (!ctrlKey && altKey) {
			blockyfish.halfChargedBoost();
			return;
		}
		if (!ctrlKey) return;

		// ctrl
		if (!shiftKey) {
			// filters
			if (lvl === CoconutCrab && lastBoost + boostCooldown > Date.now()) return;
			if (lvl === Shark && game?.currentScene?.myAnimals?.[0]?._usingSkill) {
				blockyfish.boost();
				return;
			}
			lastBoost = Date.now();
			blockyfish.chargedBoost();
			return;
		}

		// ctrl + shift
		if ([ThresherShark, BeakedWhale, BelugaWhale].includes(lvl)) {
			blockyfish.boost();
			blockyfish.chargedBoost();
			return;
		}
		if (lvl === CoconutCrab && game?.currentScene?.myAnimals?.[0]?._standing) {
			blockyfish.chargedBoost();
			setTimeout(() => blockyfish.boost(), 45);
			setTimeout(() => blockyfish.scalingBoost(41), 90);
			return;
		}
		blockyfish.superJump();
	} catch {}
};

window.addEventListener(
	"keydown",
	(e) => {
		try {
			if (e.ctrlKey || e.metaKey || e.altKey) {
				showCtrlOverlay(e);
			}
			if (e.ctrlKey || e.metaKey) {
				ctrlKey = true;
			}
			if (e.altKey) {
				altKey = true;
			}
			if (e.shiftKey) {
				shiftKey = true;
			}
			if (e.key === " " && (ctrlKey || altKey)) {
				e.stopImmediatePropagation();
			}
		} catch {}
	},
	{ capture: true },
);
window.addEventListener(
	"keyup",
	(e) => {
		try {
			if (!e.ctrlKey && !e.metaKey && !e.altKey) {
				if (overlayRef) overlayRef.style.pointerEvents = "none";
			}
			if (!e.ctrlKey && !e.metaKey) {
				ctrlKey = false;
			}
			if (!e.altKey) {
				altKey = false;
			}
			if (!e.shiftKey) {
				shiftKey = false;
			}
			if (e.key === " " && (ctrlKey || altKey)) {
				e.stopImmediatePropagation();
				executeBoost();
			}
		} catch {}
	},
	{ capture: true },
);
window.addEventListener("click", executeBoost, false);
window.addEventListener("focus", () => {
	try {
		if (overlayRef) overlayRef.style.pointerEvents = "none";
		ctrlKey = false;
		altKey = false;
		shiftKey = false;
	} catch {}
});
