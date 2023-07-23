import robot from 'robotjs';
import { open_screenshot_node_server } from './lib/run-command.js';
import 'dotenv/config';
import dns from 'dns';

function get_icon_pos(name: string) {
	const pos_list = (process.env[name] as string).split(',').map((x) => parseInt(x));
	return { x: pos_list[0], y: pos_list[1] };
}

const icon_pos = {
	arena: get_icon_pos('ARENA_ICON_POS'),
	ue5: get_icon_pos('UE5_ICON_POS'),
	obs: get_icon_pos('OBS_ICON_POS'),
	chrome: get_icon_pos('CHROME_ICON_POS'),
	login: get_icon_pos('LOGIN_ICON_POS')
};

robot.setKeyboardDelay(300);

async function sleep(ms: number) {
	await new Promise((r) => setTimeout(r, ms));
}

function key_binding(keys: Array<string>, delay: number = 0) {
	for (const key of keys) {
		robot.keyToggle(key, 'down');
	}
	robot.setKeyboardDelay(delay);
	for (const key of keys) {
		robot.keyToggle(key, 'up');
	}
}
async function back_to_desktop() {
	key_binding(['command', 'd']);
}

function unreal_play() {
	key_binding(['alt', 'p']);
}

async function switch_tab(switch_count: number = 1) {
	robot.keyToggle('alt', 'down');
	for (let i = 0; i < switch_count; i++) {
		robot.keyTap('tab');
	}
	robot.keyToggle('alt', 'up');
}

function window_go_up() {
	key_binding(['command', 'up'], 1000);
}

function window_go_left() {
	key_binding(['command', 'left'], 1000);
}

const { width, height } = robot.getScreenSize();

async function click_desktop_icon(icon_pos: { x: number; y: number }, double_click = true) {
	await back_to_desktop();
	await sleep(1000);
	robot.moveMouse(icon_pos.x, icon_pos.y);
	robot.mouseClick();
	if (double_click) robot.mouseClick();
}
async function click_login_icon(icon_pos: { x: number; y: number }) {
	robot.moveMouse(icon_pos.x, icon_pos.y);

	robot.mouseClick();
	robot.mouseClick();
}

// await sleep(4000);

// console.log('pressed')
// unreal_play();

function get_mouse_pos() {
	setInterval(() => {
		console.log(robot.getMousePos());
	}, 100);
}

async function main() {
	// Open Screenshot Server
	await click_desktop_icon(icon_pos.chrome, false);
	await sleep(3000);
	robot.keyTap('tab');
	robot.keyTap('tab');
	robot.keyTap('tab');
	robot.keyTap('enter');

	await back_to_desktop();

	await open_screenshot_node_server();
	await sleep(10000);

	// Open Unreal Engine 5
	// await open_ue5();
	await click_desktop_icon(icon_pos.obs);
	await sleep(10000);
	await click_desktop_icon(icon_pos.ue5);
	await sleep(50000);

	// Open Arena
	await click_desktop_icon(icon_pos.arena);

	await sleep(10000);
	await switch_tab(4);

	// Play UE5
	await sleep(5000);
	unreal_play();
	await sleep(3000);
	// await sleep(10000);

	// Make Arena window left, and that'll make the ue5 window right, also focus on the later one.
	//window_go_left();
	//.await sleep(1000);
	//robot.keyTap('enter');
	console.log('All done!');
}

const wait_until_connection = setInterval(async () => {
	//	get_mouse_pos();
	dns.resolve('dvtp2.2enter.art', function (err, addresses) {
		if (err) console.log(err);
		else {
			console.log(addresses);
			clearInterval(wait_until_connection);
			main();
		}
	});
}, 3000);
