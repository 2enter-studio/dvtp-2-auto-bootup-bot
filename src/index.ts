import robot from 'robotjs';
import { open_ue5 } from './lib/run-command.js';

robot.setKeyboardDelay(300);

async function sleep(ms: number) {
  await new Promise(r => setTimeout(r, ms));
}

function key_binding(keys: Array<string>) {
  for (const key of keys) {
    robot.keyToggle(key, 'down')
  }
  for (const key of keys) {
    robot.keyToggle(key, 'up')
  }
}

function unreal_play() {
  key_binding(['alt', 'p'])
}

const { width, height } = robot.getScreenSize();

// await sleep(4000);

// console.log('pressed')
// unreal_play();


async function main() {
  await open_ue5();
  await sleep(20000);

  console.log(width, height)
  unreal_play();
  // for (let i = 0; i < 10; i++) {
  //   await sleep(500)
  //   console.log(robot.getMousePos());
  // }
}
main()
