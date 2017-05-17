// @flow
export default function delay(amount: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, amount));
};