import {spawn} from 'child_process';
import 'dotenv/config';

const root_dir = process.env.PROJ_ROOT as string;

export const open_ue5 = async () => {
  const command = `${root_dir}\\\\ps-scripts\\\\open-ue5.ps1`
  console.log(command)
  const child = spawn("powershell.exe", [command]);


  child.stdout.on("data",function(data){
      console.log("Powershell Data: " + data);
  });

  child.stderr.on("data",function(data){
      console.log("Powershell Errors: " + data);
  });

  child.on("exit",function(){
      console.log("Powershell Script finished");
  });

  child.stdin.end(); //end input

}

export const open_screenshot_node_server = async () => {
  const command = `${root_dir}\\\\ps-scripts\\\\open-screenshot-server.ps1`
  console.log(command)
  const child = spawn("powershell.exe", [command]);

  child.stdout.on("data",function(data){
    console.log("Powershell Data: " + data);
  });

  child.stderr.on("data",function(data){
    console.log("Powershell Errors: " + data);
  });

  child.on("exit",function(){
    console.log("Powershell Script finished");
  });

  child.stdin.end(); //end input

}