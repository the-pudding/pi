// how many times does a polya random walk (only using digits 0-3 from pi) return to the origin?

// log out the number of returns to the origin and its index.
// log out the position every X steps

import computePi from "../src/utils/computePi.js";

const digits = 100000;
const interval = 10000;

// digit -> [dx, dy]
const STEPS = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1]
];

const piDigits = computePi(digits);
const walkDigits = piDigits
	.split("")
	.map((d, index) => ({ d, index }))
	.filter(({ d }) => +d <= 3);

let x = 0;
let y = 0;
let returns = 0;

walkDigits.forEach(({ d, index }, i) => {
	const [dx, dy] = STEPS[+d];
	x += dx;
	y += dy;
	const step = i + 1;

	if (x === 0 && y === 0) {
		returns += 1;
		console.log(
			`return #${returns} to origin at step ${step} (pi digit index ${index})`
		);
	}

	if (step % interval === 0) console.log(`step ${step}: (${x}, ${y})`);
});

console.log(
	`${returns} returns to origin in ${walkDigits.length} steps (${digits} digits of pi)`
);
