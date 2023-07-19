import robot from 'robotjs';
import { open_ue5 } from './lib/run-command.js';

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

function unreal_play() {
  key_binding(['alt', 'p'])
}

function switch_tab() {
  key_binding(['alt', 'tab'])
}

function window_go_left() {
  key_binding(['command', 'left'], 1000)
}

function open_arena() {
  key_binding(['command', 'o'])
}

const { width, height } = robot.getScreenSize();
async function click_desktop_icon(icon_pos: {x: number, y: number}) {
  const { width, height } = robot.getScreenSize();
  robot.moveMouse(width + 3, height + 10);
  await sleep(1000)
  robot.mouseClick();
  await sleep(1000)
  robot.moveMouse(icon_pos.x, icon_pos.y);
  robot.mouseClick();
  robot.mouseClick();
}

// await sleep(4000);

// console.log('pressed')
// unreal_play();


async function main() {
  await click_desktop_icon({x: 50, y:50});
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
  switch_tab();
  // for (let i = 0; i < 10; i++) {
  //   await sleep(500)
  //   console.log(robot.getMousePos());
  // }
}
main()
