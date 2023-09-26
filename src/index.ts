import robot from "robotjs";
import { open_screenshot_node_server } from "./lib/run-command.js";
import "dotenv/config";
import dns from "dns";
import get_mode from "./lib/get_argv.js";

function get_icon_pos(name: string) {
	const pos_list = (process.env[name] as string)
		.split(",")
		.map((x) => parseInt(x));
	return { x: pos_list[0], y: pos_list[1] };
}

const icon_pos = {
	arena: get_icon_pos("ARENA_ICON_POS") || { x: 0, y: 0 },
	ue5: get_icon_pos("UE5_ICON_POS") || { x: 0, y: 0 },
	obs: get_icon_pos("OBS_ICON_POS") || { x: 0, y: 0 },
	chrome: get_icon_pos("CHROME_ICON_POS") || { x: 0, y: 0 },
	login: get_icon_pos("LOGIN_ICON_POS") || { x: 0, y: 0 },
};

robot.setKeyboardDelay(300);

async function sleep(ms: number) {
	await new Promise((r) => setTimeout(r, ms));
}

function key_binding(keys: Array<string>, delay: number = 0) {
	for (const key of keys) {
		robot.keyToggle(key, "down");
	}
	robot.setKeyboardDelay(delay);
	for (const key of keys) {
		robot.keyToggle(key, "up");
	}
}
async function back_to_desktop() {
	key_binding(["command", "d"]);
}

function unreal_play() {
	key_binding(["alt", "p"]);
}

async function switch_tab(switch_count: number = 1) {
	robot.keyToggle("alt", "down");
	for (let i = 0; i < switch_count; i++) {
		robot.keyTap("tab");
	}
	robot.keyToggle("alt", "up");
}

const { width, height } = robot.getScreenSize();

async function click_desktop_icon(
	icon_pos: { x: number; y: number },
	double_click = true,
) {
	await back_to_desktop();
	await sleep(1000);
	robot.moveMouse(icon_pos.x, icon_pos.y);
	robot.mouseClick();
	if (double_click) robot.mouseClick();
}

async function login_wifi() {
	await click_desktop_icon(icon_pos.chrome, false);
	await sleep(3000);
	robot.keyTap("tab");
	robot.keyTap("tab");
	robot.keyTap("tab");
	robot.keyTap("enter");
}

function get_mouse_pos() {
	setInterval(() => {
		console.log(robot.getMousePos());
	}, 100);
}

async function main() {
	const mode = get_mode();

	// Connect to Wi-Fi
	if (["kdmofa", "kdmofa-vr", "kdmofa-cctv"].includes(mode)) {
		console.log("Login to Wi-Fi");
		await login_wifi();
		await sleep(5000);
	}

	// Open Screenshot Server and OBS Studio
	if (["kdmofa", "moca", "linz", "draft-land"].includes(mode)) {
		console.log("Opening Screenshot Server");
		await open_screenshot_node_server();
		await sleep(10000);
		console.log("Opening OBS Studio");
		await click_desktop_icon(icon_pos.obs);
		await sleep(12000);
	}

	// Open Unreal Engine 5
	if (["kdmofa", "moca", "linz", "kdmofa-vr", "draft-land"].includes(mode)) {
		console.log("Opening Unreal Engine 5");
		await click_desktop_icon(icon_pos.ue5);
		await sleep(60000);
	}

	// Open Arena
	if (["kdmofa", "moca", "linz", "draft-land"].includes(mode)) {
		console.log("Opening Resolume Arena");
		await click_desktop_icon(icon_pos.arena);
		// Switch back to UE5
		await sleep(30000);
		console.log("Switching Tab 4 Times");
		await switch_tab(4);

		await sleep(5000);
	}

	if (mode === "moca-vr") {
		await sleep(3000);
		console.log("Switching Tab 3 Times");
		await switch_tab(3);
		// await sleep(3000);
		// Closing Edge
		// key_binding(["control", "w"]);
		// console.log("Closing Edge Browser");
		await sleep(3000);
	}
	// Play UE5
	if (
		[
			"kdmofa",
			"moca",
			"linz",
			"kdmofa-vr",
			"moca-vr",
			"linz-vr",
			"draft-land",
		].includes(mode)
	) {
		console.log("Playing Unreal Engine 5 through keyboard shortcut: alt+P");
		unreal_play();
	}
	console.log("All done!");
}

const wait_until_connection = setInterval(async () => {
	//	get_mouse_pos();
	dns.resolve("dvtp2.2enter.art", function(err, addresses) {
		if (err) console.log(err);
		else {
			console.log(addresses);
			clearInterval(wait_until_connection);
			main();
		}
	});
}, 3000);
