// how many times does a polya random walk (only using digits 0-3 from pi) return to the origin?

// streams digits from a file (default tasks/billion.txt) or stdin ("-"),
// so it scales to billions of digits. a leading "3." is skipped.
// usage: node tasks/origin.js [file|-] [interval]

// log out the number of returns to the origin and its index.
// log out the position every X steps

import fs from "fs";
import { fileURLToPath } from "url";

const file =
	process.argv[2] ?? fileURLToPath(new URL("./billion.txt", import.meta.url));
const interval = +(process.argv[3] ?? 10_000_000);

// digit -> [dx, dy], same as Walk.svelte: 0 north, 1 east, 2 south, 3 west (y down)
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

const ZERO = 48;
const DOT = 46;

const stream =
	file === "-"
		? process.stdin
		: fs.createReadStream(file, { highWaterMark: 1 << 24 });

let x = 0;
let y = 0;
let step = 0;
let index = -1;
let returns = 0;
let head = true;

const start = Date.now();

for await (const chunk of stream) {
	let i = 0;
	// skip the "3." prefix so index 0 is the first decimal digit
	if (head) {
		head = false;
		if (chunk[0] === ZERO + 3 && chunk[1] === DOT) i = 2;
	}

	for (; i < chunk.length; i++) {
		const d = chunk[i] - ZERO;
		if (d < 0 || d > 9) continue;
		index++;
		if (d > 3) continue;

		x += DX[d];
		y += DY[d];
		step++;

		if (x === 0 && y === 0) {
			returns += 1;
			console.log(
				`return #${returns} to origin at step ${step} (pi digit index ${index})`
			);
		}

		// if (step % interval === 0) console.log(`step ${step}: (${x}, ${y})`);
	}
}

console.log(
	`${returns} returns to origin in ${step} steps (${index + 1} digits of pi) in ${((Date.now() - start) / 1000).toFixed(1)}s`
);
