import {getFieldsGrqphql} from "../utils";
import {fields as cardFields} from '../graphqlConfig/Cards';

export const fields = [
	{key: 'id', graphqlType: 'ID', editable: false, width: 100},
	{
		key: 'class_id',
		graphqlType: 'ID',
		editable: false,
		width: 150,
		dropDown: true,
		dataField: 'classes',
		nullLabel: "Assign class"
	},
	{key: 'level', graphqlType: 'Int', editable: true, width: 100},
	{key: 'instructions', graphqlType: 'String', editable: true, width: 400, multiline: true},
	{key: 'deck_id', graphqlType: 'ID', editable: false, width: 100},
	{
		key: 'pool_id',
		graphqlType: 'ID',
		editable: false,
		width: 150,
		dropDown: true,
		dataField: 'pools',
		nullLabel: "Entire deck"
	},
	{key: 'standOnCards', graphqlType: '[Card]', editable: false, subFields: cardFields},
	{key: 'order', graphqlType: 'Int', editable: false, width: 100},
];


export const query = `
query games($deck_id: ID) {
	games(deck_id: $deck_id) {
		${getFieldsGrqphql(fields)}
	}
}
`;

export const upsertMutation = `
mutation upsert($updatedRows: [GameInput]) {
	upsertGames(games: $updatedRows) {
		${getFieldsGrqphql(fields)}
	}
}
`;

export const deleteMutation = `
mutation delete($rowsToDelete: [GameInput]) {
	deleteGames(games: $rowsToDelete)
}
`;

