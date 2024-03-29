// @flow

export type Account = {
	id: string,
	name: string,
	balanceCZK: number,
	creditTransactions: {
		amount: number
	}
}