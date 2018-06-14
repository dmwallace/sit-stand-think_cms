import {getFieldsGrqphql} from "../utils";

export const fields = [
	{key: 'id', graphqlType: 'ID', editable: false, width: 100},
	{key: 'name', graphqlType: 'String', editable: true, width: 200},
	{key: 'description', graphqlType: 'String', editable: true},
	{key: 'order', graphqlType: 'Int', editable: false, width: 100},
];

export const extraColumns = [
	{
		key: 'cards',
		type: 'editLink',
		width: 100,
		editable: true,
	},
	{
		key: 'pools',
		type: 'editLink',
		width: 100,
		editable: true,
	},
	{
		key: 'games',
		type: 'editLink',
		width: 100,
		editable: true,
	},
];

export const query = `
query {
	decks {
		${getFieldsGrqphql(fields)}
	}
}
`;

export const upsertMutation = `
mutation upsert($updatedRows: [DeckInput]) {
	upsertDecks(decks: $updatedRows) {
		${getFieldsGrqphql(fields)}
	}
}
`;

export const deleteMutation = `
	mutation delete($rowsToDelete: [DeckInput]) {
		deleteDecks(decks: $rowsToDelete)
	}
`;