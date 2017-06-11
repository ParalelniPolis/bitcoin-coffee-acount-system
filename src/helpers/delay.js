// @flow
export default function delay(amount: number): Promise<Function> {
		return new Promise(resolve => setTimeout(resolve, amount));
};