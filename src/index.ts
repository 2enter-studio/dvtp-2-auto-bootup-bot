import robot from 'robotjs';
import { open_ue5 } from './lib/run-command.js';
import 'dotenv/config'
import dns from 'dns'

const arena_pos_list = (process.env.ARENA_ICON_POS as string).split(',').map((x) => parseInt(x));
const arena_icon_pos = { x: arena_pos_list[0], y: arena_pos_list[1] };

robot.setKeyboardDelay(300);

async function sleep(ms: number) {
  await new Promise(r => setTimeout(r, ms));
}

function key_binding(keys: Array<string>, delay: number = 0) {
  for (const key of keys) {
    robot.keyToggle(key, 'down')
  }
  robot.setKeyboardDelay(delay);
  for (const key of keys) {
    robot.keyToggle(key, 'up')
  }
}
async function back_to_desktop() {
  key_binding(['command', 'd']);
}

function unreal_play() {
  key_binding(['alt', 'p'])
}

async function switch_tab(switch_count: number = 1){
  robot.keyToggle('alt', 'down')
  for (let i = 0; i < switch_count; i++) {
    robot.keyTap('tab')
  }
  robot.keyToggle('alt', 'up')
}

function window_go_left() {
  key_binding(['command', 'left'], 1000)
}


const { width, height } = robot.getScreenSize();
async function click_desktop_icon(icon_pos: {x: number, y: number}) {
  await back_to_desktop();
  await sleep(1000);
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
  await click_desktop_icon(arena_icon_pos);
  await sleep(1000);
  await switch_tab(5);
  await sleep(10000);


  window_go_left();
  await sleep(1000);
  robot.keyTap('enter');
  await sleep(100000);
  await open_ue5();
  await sleep(20000);

  console.log(width, height)
  unreal_play();
  await sleep(1000)
  // await switch_tab();
  // for (let i = 0; i < 10; i++) {
  //   await sleep(500)
  //   console.log(robot.getMousePos());
  // }
}

// get_mouse_pos();
const wait_until_connection = setInterval(async () => {
  dns.resolve('dvtp2.2enter.art', function(err, addresses) {
    if (err) console.log(err);
    else {
      console.log(addresses);
      clearInterval(wait_until_connection);
      main();
    }
  })
}, 3000)
