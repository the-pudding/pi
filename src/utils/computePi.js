export default function pi(digits) {
	const guard = 10n;
	const scale = 10n ** (BigInt(digits) + guard);

	const arctanInv = (x) => {
		const x2 = x * x;
		let term = scale / x;
		let sum = term;
		let n = 1n;
		let sign = -1n;
		while (term !== 0n) {
			term /= x2;
			n += 2n;
			sum += sign * (term / n);
			sign = -sign;
		}
		return sum;
	};

	const p = 4n * (4n * arctanInv(5n) - arctanInv(239n));
	const s = (p / 10n ** guard).toString();
	const result = s.slice(1);
	return result;
}
