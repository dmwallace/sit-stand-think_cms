import {getFieldsGrqphql} from "../utils";

export const fields = [
	{key: 'id', graphqlType: 'ID', editable: false, width: 100},
	{key: 'deck_id', graphqlType: 'ID', editable: false, width: 100},
	{key: 'name', graphqlType: 'String', editable: true, width: 200},
	{key: 'description', graphqlType: 'String', editable: true},
	{key: 'image', graphqlType: 'Upload', editable: true, width: 350},
	{key: 'order', graphqlType: 'Int', editable: false, width: 100},
];

export const query = `
query cards($deck_id: ID){
	cards(deck_id: $deck_id) {
		${getFieldsGrqphql(fields)}
	}
}
`;

export const upsertMutation = `
mutation upsert($updatedRows: [CardInput]) {
	upsertCards(cards: $updatedRows) {
		${getFieldsGrqphql(fields)}
	}
}
`;

export const deleteMutation = `
	mutation delete($rowsToDelete: [CardInput]) {
		deleteCards(cards: $rowsToDelete)
	}
`;