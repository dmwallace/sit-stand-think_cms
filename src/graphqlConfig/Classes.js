import {getFieldsGrqphql} from "../utils";

export const fields = [
	{key: 'id', graphqlType: 'ID', editable: false, width: 100},
	{key: 'name', graphqlType: 'String', editable: true},
	{key: 'order', graphqlType: 'Int', editable: false, width: 100},
];

export const query = `
query {
	classes {
		${getFieldsGrqphql(fields)}
	}
}
`;

//console.log("query", query);
export const upsertMutation = `
mutation upsert($updatedRows: [ClassInput]) {
	upsertClasses(classes: $updatedRows) {
		${getFieldsGrqphql(fields)}
	}
}
`;

export const deleteMutation = `
	mutation delete($rowsToDelete: [ClassInput]) {
		deleteClasses(classes: $rowsToDelete)
	}
`;