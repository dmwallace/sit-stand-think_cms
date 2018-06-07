import {getFieldsGrqphql} from "../utils";
import {fields as cardFields} from '../graphqlConfig/Cards';

export const fields = [
	{key: 'id', graphqlType: 'ID', editable: false, width: 100},
	{key: 'deck_id', graphqlType: 'ID', editable: false, width: 100},
	{key: 'name', graphqlType: 'String', editable: true, width: 300},
	{key: 'cards', graphqlType: '[Card]', editable: false, subFields: cardFields},
	{key: 'order', graphqlType: 'Int', editable: false, width: 100},

];

export const query = `
query pools($deck_id: ID){
	pools(deck_id: $deck_id) {
		${getFieldsGrqphql(fields)}
	}
}
`;

export const upsertMutation = `
mutation upsert($updatedRows: [PoolInput]) {
	upsertPools(pools: $updatedRows) {
		${getFieldsGrqphql(fields)}
	}
}
`;

export const deleteMutation = `
mutation delete($rowsToDelete: [PoolInput]) {
	deletePools(pools: $rowsToDelete)
}
`;

