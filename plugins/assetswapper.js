// @name Asset Swapper
// @id assetswapper
// @description Use custom skins in-game (doesn't show for other players), copy skin IDs from store
// @author pi
// @tags visual, client-side

plugin.registerKeybind("Toggle skin swapper modal", "KeyK");

let keyMap;
const _keyMap = navigator.keyboard.getLayoutMap();
(async () => {
	keyMap = await _keyMap;
})();

let skinIdPersist = "";
let extModalVisible = false;
let extInputFocus = false;
let singletonInter = null;
let toggleModal = () => {};
const AssetSwapButton = () => {
	const [hovered, setHovered] = React.useState(false);
	const [modalVisible, setModalVisible] = React.useState(false);
	const [inputFocus, setInputFocus] = React.useState(false);
	const [skinId, setSkinId] = React.useState(skinIdPersist);

	React.useEffect(() => {
		skinIdPersist = skinId;
		try {
			if (skinId == "") return;
			const n = +skinId;
			if (!Number.isNaN(n)) game.currentScene.myAnimal.setSkin(n);
		} catch {}
	}, [skinId]);

	React.useEffect(() => {
		toggleModal = () => {
			setModalVisible(!modalVisible);
		};
		extModalVisible = modalVisible;
	}, [modalVisible, setModalVisible]);

	React.useEffect(() => {
		extInputFocus = inputFocus;
	}, [inputFocus, setInputFocus]);

	React.useEffect(() => {
		try {
			clearInterval(singletonInter);
		} catch {}

		singletonInter = setInterval(() => {
			try {
				if (skinIdPersist == "") return;
				const n = +skinIdPersist;
				if (!Number.isNaN(n)) game.currentScene.myAnimal.setSkin(n);
			} catch {}
		}, 1000);

		const handleKeyDown = (e) => {
			if (extModalVisible && extInputFocus && !Number.isNaN(+e.key)) {
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				setSkinId("" + (skinIdPersist.match(/\d+/) ?? "") + e.key);
			}
		};
		window.addEventListener("keydown", handleKeyDown, {
			capture: true,
			passive: false,
		});

		return () => {
			clearInterval(singletonInter);
			window.removeEventListener("keydown", handleKeyDown, {
				capture: true,
				passive: false,
			});
		};
	}, []);

	return (
		<>
			<button
				id="asset-swap-btn"
				style={{
					height: "2.5rem",
					width: "2.5rem",
					background: hovered ? "#000" : "#0000004d",
					borderRadius: "0.375rem",
					padding: "0.25rem",
					position: "relative",
					cursor: "pointer",
					pointerEvents: "all",
					fontSize: "0.8rem",
					fontWeight: "500",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					transition: "color 0.15s",
				}}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				onClick={() => setModalVisible(true)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="1.625em"
					height="1.625em"
					fill="#fff"
				>
					<path d="M2.53,19.65L3.87,20.21V11.18L1.44,17.04C1.03,18.06 1.5,19.23 2.53,19.65M22.03,15.95L17.07,4C16.76,3.23 16.03,2.77 15.26,2.75C15,2.75 14.73,2.79 14.47,2.9L7.1,5.95C6.35,6.26 5.89,7 5.87,7.75C5.86,8 5.91,8.29 6,8.55L11,20.5C11.29,21.28 12.03,21.74 12.81,21.75C13.07,21.75 13.33,21.7 13.58,21.6L20.94,18.55C21.96,18.13 22.45,16.96 22.03,15.95M7.88,8.75A1,1 0 0,1 6.88,7.75A1,1 0 0,1 7.88,6.75C8.43,6.75 8.88,7.2 8.88,7.75C8.88,8.3 8.43,8.75 7.88,8.75M5.88,19.75A2,2 0 0,0 7.88,21.75H9.33L5.88,13.41V19.75Z" />
				</svg>
				{keyMap && (
					<div
						style={{
							pointerEvents: "none",
							position: "absolute",
							bottom: "-0.175rem",
							right: "-0.175rem",
							fontSize: "0.8em",
							background: "#0000004d",
							border: "1px solid #6b728066",
							borderRadius: ".375rem",
							padding: "0.3em 0.25rem 0.2em",
							lineHeight: "1em",
						}}
					>
						{keyMap
							.get(plugin.getKeybind("Toggle skin swapper modal"))
							.toUpperCase()}
					</div>
				)}
			</button>
			<Modal
				title="Asset Swapper"
				onClose={() => setModalVisible(false)}
				visible={modalVisible}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
					onFocus={() => setInputFocus(true)}
					onBlur={() => setInputFocus(false)}
				>
					<DeeeepioTextInput
						placeholder="Skin ID"
						value={skinId}
						onChange={(v) => {
							setSkinId(v.match(/\d+/));
						}}
					/>
					<DeeeepioButton
						color="gray"
						type="regular"
						onClick={() => setModalVisible(false)}
					>
						Close
					</DeeeepioButton>
				</div>
			</Modal>
		</>
	);
};

const createUi = async () => {
	try {
		document.getElementById("asset-swap-btn").parentElement.remove();
	} catch {}

	const container = document.createElement("div");
	let targetInsertion = document.querySelector(
		".top-right .buttons.button-bar .inner",
	);
	if (!targetInsertion) {
		await new Promise((resolve) => {
			const inter = setInterval(() => {
				targetInsertion = document.querySelector(
					".top-right .buttons.button-bar .inner",
				);
				if (!targetInsertion) return;
				clearInterval(inter);
				resolve();
			}, 300);
		});
	}
	targetInsertion.prepend(container);
	await _keyMap;
	ReactDOM.createRoot(container).render(<AssetSwapButton />);
};

let game;

blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
	createUi();
});

let held = false;
plugin.onKeybindDown("Toggle skin swapper modal", () => {
	if (held) return;
	held = true;
	toggleModal();
});
plugin.onKeybindUp("Toggle skin swapper modal", () => {
	held = false;
});

const storeListCb = () => {
	for (const skin of document.querySelectorAll(
		".skins-container .skin:not(:has(.id-copy))",
	)) {
		const container = document.createElement("div");
		skin.appendChild(container);
		ReactDOM.createRoot(container).render(
			<button
				className="id-copy"
				style={{
					background: "#0004",
					borderRadius: "0.5rem",
					height: "2rem",
					width: "2rem",
					position: "absolute",
					top: "0.25rem",
					left: "0.25rem",
					pointerEvents: "all",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
				onClickCapture={(e) => {
					e.stopImmediatePropagation();
					try {
						const id = skin
							.querySelector("img")
							.src.match(/(?<=deeeep\.io\/custom\/skins\/)\d+/)[0];
						navigator.clipboard
							.writeText(id)
							.then(() => ui.toast.success("Copied skin ID"));
					} catch {
						ui.toast.error("Couldn't copy skin ID");
					}
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="1.5rem"
					height="1.5rem"
					fill="#fff"
				>
					<path d="M10 7V9H9V15H10V17H6V15H7V9H6V7H10M16 7C17.11 7 18 7.9 18 9V15C18 16.11 17.11 17 16 17H12V7M16 9H14V15H16V9Z" />
				</svg>
			</button>,
		);
	}
};
(async () => {
	let observeContainer = document.querySelector("#app .vfm.modal");
	if (!observeContainer) {
		await new Promise((resolve) => {
			const inter = setInterval(() => {
				observeContainer = document.querySelector("#app .vfm.modal");
				if (observeContainer) {
					clearInterval(inter);
					resolve();
				}
			}, 500);
		});
	}
	const cb = () => {
		if (router.getCurrent().name.includes("StoreSkins")) {
			storeListCb();
		}
	};
	const observer = new MutationObserver(cb);
	observer.observe(observeContainer, {
		childList: true,
		subtree: true,
		attributes: true,
	});
	cb();
})();
