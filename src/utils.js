export function indent(level) {
	let indent = '';
	for (let i = 0; i < level; i++) {
		indent = `${indent}\t`
	}
	return indent;
}

export function getFieldsGrqphql(fields, level = 2) {
	return fields.map((field, index) => {
		let localIndent = index === 0 && level === 2 ? '' : indent(level);
		
		let str = `${localIndent}${field.key}`;
		
		if (field.subFields) {
			str = `${str} {\n${getFieldsGrqphql(field.subFields, level + 1)}\n${localIndent}}`
		}
		
		return str;
	}).join(`\n`);
}