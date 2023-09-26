import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { Argv } from "yargs";

const modes = [
	"kdmofa",
	"kdmofa-vr",
	"kdmofa-cctv",
	"moca-vr",
	"moca",
	"linz",
	"linz-vr",
	"draft-land",
];

export default () => {
	const argv = yargs(hideBin(process.argv)).argv;
	// @ts-ignore
	const { mode } = argv;
	if (!modes.includes(mode)) {
		console.log(`Invalid location: ${mode}`);
		process.exit(1);
	} else {
		console.log(mode);
		return mode;
	}
};
