cd "..\\screenshot-server";

while ($true) {
  git pull
  pnpm i 
  tsc
  node dist 
}
