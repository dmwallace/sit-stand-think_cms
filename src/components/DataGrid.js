import React from 'react';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {observable, computed, intercept, autorun, toJS} from 'mobx';
import {observer} from 'mobx-react';
import ReactDataGrid from 'react-data-grid';
import {Route} from 'react-router-dom';
import CardsSelector from './CardsSelector';
import Header from './Header';
import HeightAwareDataGrid from './HeightAwareDataGrid';
import CardsFormatter from './CardsFormatter';
import ImageUploadFormatter from './ImageUploadFormatter';
import {Button} from 'reactstrap';
import ReactDOM from 'react-dom';
const {Editors, Formatters} = require('react-data-grid-addons');
const {DropDownEditor} = Editors;
const {DropDownFormatter} = Formatters;


const {
	Draggable: {Container: DraggableContainer, RowActionsCell, DropTargetRowContainer},
	Data: {Selectors}
} = require('react-data-grid-addons');


const RowRenderer = DropTargetRowContainer(ReactDataGrid.Row);

const EditButton = (props) => {
	
	return props.dependentValues.id ?
		<Link to={`/deck/${props.dependentValues.id}/${props.label}`}>Edit {props.label}</Link> : null;
};

class TextAreaFormatter extends React.Component {
	
	render() {
		return <div
			style={{height: '110px', padding: '5px 0'}}
		>
			<textarea
				style={{width: '100%', height: '100px'}}
				value={this.props.value}
			/>
		</div>;
	}
}

class TextAreaEditor extends React.Component {
	getInputNode = ()=> {
		let domNode = ReactDOM.findDOMNode(this);
		return domNode.querySelector('textarea');
	}
	
	getValue = ()=> {
		// return the value depending on the way you decide to store the textarea text.
		console.log("this.getInputNode()", this.getInputNode());
		return {[this.props.column.name]: this.getInputNode().value};
	}
	
	handleKeyDown = (e)=> {
		console.log("e.key", e.key);
		
		
		if (e.key === 'Enter' && e.shiftKey) {
			e.stopPropagation();
		}
		
		if(e.key.substr(0, 'Arrow'.length) === 'Arrow') {
			e.stopPropagation();
		}
	}
	
	render() {
		return <div
			style={{height: '110px', padding: '0px 8px', boxSizing: 'border-box'}}
		>
			<textarea
				style={{width: '100%', height: '91px'}}
				onKeyDown={this.handleKeyDown} defaultValue={this.props.value}
			/>
		</div>;
	}
}

export default withRouter(observer(class extends React.Component {
	
	static propTypes = {
		rowKey: PropTypes.string.isRequired,
		fields: PropTypes.array.isRequired,
		rowData: PropTypes.array,
		extraColumns: PropTypes.array,
	};
	
	static defaultProps = {
		rowKey: 'id',
		extraColumns: []
	};
	
	hasIncompleteColumnData = true;
	@observable columns = [];
	@observable rows = [];
	@observable selectedIds = [];
	
	
	getHighestColumnValue(rows, column) {
		//console.log("rows", toJS(rows));
		return rows.reduce((highest, row) => {
			if (parseInt(row[column]) > parseInt(highest)) {
				highest = parseInt(row[column]);
			}
			return highest;
		}, 0);
	}
	
	/*ensureBlankRow = intercept(this.rows, null, (change)=>{
		//console.log("change.newValue", change.newValue);
		
		let rows = change.newValue;
		
		if(!rows.length || rows[rows.length -1].id) {
			let blankRow = this.props.fields.reduce((row, field) => {
				//////console.log("field", field);
				if (field.key === 'order') {
					row[field.key] = this.getHighestColumnValue(rows, "order") + 1;
				} else {
					row[field.key] = this.props.match.params[field.key] || field.defaultValue || null;
				}
				return row;
			}, {});
			
			rows.push(blankRow);
			
			change.newValue = rows;
		}
		
		return change;
	});*/
	
	ensureBlankrow = autorun(() => {
		if (!this.rows.length || this.rows[this.rows.length - 1].id) {
			if(this.getBlankRow) {
				this.rows.push(this.getBlankRow());
			}
		}
	});
	
	getBlankRow = () => {
		return this.props.fields.reduce((row, field) => {
			//console.log("field", field);
			if (field.key === 'order') {
				row[field.key] = this.getHighestColumnValue(this.rows, "order") + 1;
			} else {
				row[field.key] = this.props.match.params[field.key] || field.defaultValue || null;
			}
			return row;
		}, {});
	};

	componentWillReceiveProps(nextProps, nextContext) {
		this.populateData(nextProps);
	}
	
	componentDidMount() {
		this.populateData(this.props);
	}
	
	componentDidUpdate(prevProps, prevState, prevContext) {
		this.populateData(this.props);
	}
	
	populateData = (props) => {
		if (!this.columns.length || this.hasIncompleteColumnData) {
			this.columns = this.createColumns(props);
		}
		
		if (!this.rows.length && props.rowData) {
			this.createRows(props);
		}
		
		console.log("this.rows", toJS(this.rows));
		
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 0);
	};
	
	updateRowOrders = (rows) => {
		rows = rows.slice();
		
		try {
			let rowsToUpsert = [];
			rows.map((row, index) => {
				if (parseInt(row.order) !== index + 1) {
					row.order = index + 1;
					
					let updated = {id: parseInt(row.id), order: parseInt(row.order)};
					
					if(!isNaN(parseInt(row.id))) {
						rowsToUpsert.push(updated);
					}
				}
				return row;
			});
			
			//console.log("rowsToUpsert", rowsToUpsert);
			rowsToUpsert.length > 0 && this.props.upsertMutation({variables: {updatedRows: rowsToUpsert}}).then((result) => {
				//console.log("result", result);
			});
			
			return rows;
		} catch (err) {
			return rows
		}
	}
	
	createColumns = (props) => {
		//console.log("createColumns");
		////console.log("props.fields", props.fields);
		////console.log("props.extraColumns", props.extraColumns);
		
		////console.log("props.fields", props.fields);
		//let fields = props.fields.slice().concat(props.extraColumns.slice());
		//let fields = props.extraColumns.concat(props.fields).concat(props.extraColumns);
		////console.log("fields", fields);
		let fields = props.fields.slice();
		fields.splice(3, 0, ...props.extraColumns);
		
		//fields = props.extraColumns;
		
		let hasCompleteColumnData = true;
		
		let columns = fields.map((field) => {
			let column = {
				name: field.key,
				...field,
				sortable: true,
			};
			
			if(column.multiline) {
				column.editor = TextAreaEditor;
				column.formatter = <TextAreaFormatter />;
			} else if (column.type === 'editLink') {
				column.value = column.key;
				column.formatter = (localProps) => (<EditButton {...props} {...localProps} label={column.key}/>);
			} else if (column.graphqlType === '[Card]') {
				column.formatter = (props) => (
					<CardsFormatter {...props} onChange={this.handleGridRowsUpdated}/>
				);
				
			} else if (column.graphqlType === 'Upload') {
				column.formatter = (props) => (
					<ImageUploadFormatter {...props} onChange={this.handleGridRowsUpdated}/>
				);
			} else if (column.dropDown && column.dataField) {
				if (props[column.dataField] && props[column.dataField][column.dataField]) {
					let options = [{
						id: null,
						value: null,
						text: column.nullLabel,
						title: null,
					}].concat(props[column.dataField][column.dataField].map((field) => {
						return {
							...field,
							value: field.id,
							text: field.name,
							title: field.name,
						}
					}));
					
					//console.log("options", options);
					column.editor = <DropDownEditor options={options}/>;
					column.formatter = (props)=> (<DropDownFormatter options={options} {...props}/>);
				} else {
					hasCompleteColumnData = false;
				}
			}
			
			this.hasIncompleteColumnData = !hasCompleteColumnData;
			
			column.getRowMetaData = (row) => row;
			return column;
		});
		
		//columns = extraColumns.concat(columns);
		//columns = columns.concat(extraColumns);
		////console.log("columns", columns);
		if(hasCompleteColumnData) {
			return columns;
		}
		return this.columns;
	};
	
	createRows = (props) => {
		//////////console.log("createRows");
		if (!props.rowData) return;
		
		this.rows = this.updateRowOrders(props.rowData.slice().sort((a, b) => a.order - b.order).map((row, index) => {
				let newRow = this.columns.reduce((newRow, {key: columnKey}) => {
					////console.log("columnKey", columnKey);
					////console.log("value", value);
					newRow[columnKey] = row[columnKey] || null;
					return newRow;
				}, {});
				
				newRow && (newRow.index = index);
				
				return newRow;
			}
		) || []);
		
		
		////console.log("this.rows", this.rows);
	}
	
	getRow = (index) => {
		let row = this.rows[index];
		row && (row.index = index);
		return row;
	}
	
	isDraggedRowSelected = (selectedRows, rowDragSource) => {
		if (selectedRows && selectedRows.length > 0) {
			let key = this.props.rowKey;
			return selectedRows.filter(r => r[key] === rowDragSource.data[key]).length > 0;
		}
		return false;
	};
	
	reorderRows = (e) => {
		//////////console.log("e", e);
		let selectedRows = Selectors.getSelectedRowsByKey({
			rowKey: this.props.rowKey,
			selectedKeys: this.selectedIds,
			rows: this.rows
		});
		let draggedRows = this.isDraggedRowSelected(selectedRows, e.rowSource) ? selectedRows : [e.rowSource.data];
		let undraggedRows = this.rows.filter(function (r) {
			return draggedRows.indexOf(r) === -1;
		});
		let args = [e.rowTarget.idx, 0].concat(draggedRows);
		//////////console.log("args", args);
		Array.prototype.splice.apply(undraggedRows, args);
		
		this.rows = this.updateRowOrders(undraggedRows);
	};
	
	onRowsSelected = (rows) => {
		this.selectedIds = this.selectedIds.concat(rows.map(r => r.row[this.props.rowKey])).filter((id) => !isNaN(parseInt(id)));
	};
	
	onRowsDeselected = (rows) => {
		let rowIds = rows.map(r => r.row[this.props.rowKey]);
		this.selectedIds = this.selectedIds.filter(i => rowIds.indexOf(i) === -1);
	};
	
	handleGridRowsUpdated = ({fromRow, toRow, updated}) => {
		console.log("fromRow", fromRow);
		console.log("toRow", toRow);
		console.log("updated", updated);
		
		if(typeof updated === "string") {
			debugger;
		}
		if(fromRow === undefined || fromRow === null) {
			fromRow = this.rows.length - 1;
		}
		if(toRow === undefined || fromRow === null) {
			toRow = this.rows.length -1;
		}
		
		this.props.fields.forEach((field) => {
			console.log("field", field);
			if (field.dropDown && field.nullLabel && updated[field.key] === field.nullLabel) {
				console.log("yoooooo");
				
				
				updated[field.key] = null // stop dropdown label being assigned as value
			}
		});
		
		let rows = this.rows.slice();
		let updatedRows = [];
		
		for (let i = fromRow; i <= toRow; i++) {
			let rowToUpdate = rows[i];
			//let updatedRow = update(rowToUpdate, {$merge: updated});
			
			let updatedRow = this.columns.reduce((updatedRow, column) => {
				//////////console.log("updated[column.key]", updated[column.key]);
				////console.log("column.key", column.key);
				////console.log("updated[column.key]", updated[column.key]);
				////console.log("rowToUpdate[column.key]", rowToUpdate[column.key]);
				
				if (updated[column.key] !== undefined && (updated[column.key] !== rowToUpdate[column.key])) {
					updatedRow[column.key] = updated[column.key];
				}
				
				if(!rowToUpdate.id && !updated[column.key] && rowToUpdate[column.key]) {
					updatedRow[column.key] = rowToUpdate[column.key];
				}
				return updatedRow;
			}, {});
			
			if (rowToUpdate.id) {
				updatedRow.id = rowToUpdate.id
			} /*else if(rowToUpdate.order) {
				updatedRow.order = rowToUpdate.order
			}*/
			
			console.log("rowToUpdate", rowToUpdate);
			console.log("updatedRow", updatedRow);
			//console.log("updatedRow.image", updatedRow.image);
			updatedRows.push(updatedRow);
			rows[i] = {...rows[i], ...updatedRow};
		}
		
		
		//let rowsBackup = this.rows.slice();
		//this.rows = rows;
		
		//console.log("updatedRows", updatedRows);
		
		return this.props.upsertMutation({variables: {updatedRows}}).then((result) => {
			//console.log("update rows result", result);
			// todo check for error and revert rowsBackup
			
			let results = result.data[Object.keys(result.data)[0]];
			
			results.forEach((updatedRow, index) => {
				let row = rows[fromRow + index];
				row = {...row, ...updatedRow};
				rows[fromRow + index] = row;
			});
			
			this.rows = rows;
			
		});
		
		//this.rows = rows;
	};
	
	
	onDelete = () => {
		this.selectedIds = this.selectedIds.filter((id) => id !== null);
		
		if (!this.selectedIds.length) return;
		
		
		
		this.props.deleteMutation({
			variables: {
				rowsToDelete: this.selectedIds.map((id) => ({id}))
			}
		}).then((result) => {
			//////////console.log("result", result);
			// todo check for error and undo delete
			
			
		});
		
		this.rows = this.updateRowOrders(this.rows.filter((row) => !this.selectedIds.find((id) => parseInt(row.id) === parseInt(id))));
		this.selectedIds = [];
		
	}
	
	handleGridSort = (sortColumn, sortDirection) => {
		const comparer = (a, b) => {
			if (sortDirection === 'ASC') {
				return (!a.id || a[sortColumn].localeCompare(b[sortColumn]));
			} else if (sortDirection === 'DESC') {
				return (!a.id || -a[sortColumn].localeCompare(b[sortColumn]));
			}
		};
		
		const rows = sortDirection === 'NONE' ? this.rows.slice(0) : this.rows.sort(comparer);
		
		this.rows = this.updateRowOrders(rows);
	};
	
	render() {
		//////////console.log("this.rows.length", this.rows.length);
		console.log("this.rows", toJS(this.rows));
		////////console.log("this.props", this.props);
		
		//////////console.log("this.columns", toJS(this.columns));
		////console.log("this.props.rowData", this.props.rowData);
		////console.log("this.columns", this.columns);
		//console.log("this.rows", toJS(this.rows));
		if (!this.props.rowData || !this.columns.length) {
			return (
				<Header>loading...</Header>
			)
		}
		
		
		return (
			<div className="flex grow">
				
				<Route path={`${this.props.match.path}/:row_index/cards`} component={(props) => {
					//////////console.log("props.match", props.match);
					let rowIndex = parseInt(props.match.params.row_index);
					let row = this.rows[rowIndex];
					
					let cardField = this.props.fields.find((field) => field.graphqlType === '[Card]');
					if (!cardField) {
						return null;
					}
					
					//console.log("row", row);
					let selectedCards = row[cardField.key] || [];
					//console.log("cardField.key", cardField.key);
					//console.log("row[cardField.key]", row[cardField.key]);
					
					//console.log("selectedCards", selectedCards);
					
					let title;
					
					let pathComponents = this.props.match.path.split('/');
					let lastPathComponent = pathComponents[pathComponents.length - 1];
					
					if(lastPathComponent === 'pools') {
						title = `Select cards in pool: [${row.id}] ${row.name}`
					} else  if(lastPathComponent === 'games') {
						title = `Select cards to stand on for game: [${row.id}] ${row.name || row.instructions}`
					}
					
					return (
						<CardsSelector
							{...this.props}
							title={title}
							selectedCards={selectedCards}
							onSelected={(selectedCards) => {
								//console.log("cardField.key", cardField.key);
								
								selectedCards = selectedCards.reduce((selectedCards, card) => {
									let updatedCard = {};
									
									cardField.subFields.forEach(({key}) => {
										if (card[key]) {
											updatedCard[key] = card[key];
										}
									})
									
									if (updatedCard.id) {
										selectedCards.push(updatedCard);
									}
									return selectedCards;
								}, []);
								
								//console.log("selectedCards", selectedCards);
								
								this.handleGridRowsUpdated({
									fromRow: rowIndex,
									toRow: rowIndex,
									updated: {
										[cardField.key]: selectedCards
									}
								})
							}}/>
					)
				}}/>
				
				<Header>
					<h2>{this.props.title}</h2>
					<div style={{display: 'flex', flexDirection: 'row', height: '3rem', alignItems: 'center'}}>
						{
							this.selectedIds.length > 0 &&
							<Button color="danger" style={{marginRight: '1rem'}}
							        onClick={this.onDelete}>Delete {this.selectedIds.length} Selected</Button>
						}
						{this.props.toolbarComponent && <this.props.toolbarComponent handleGridRowsUpdated={this.handleGridRowsUpdated}/>}
					</div>
					
				
				</Header>
				<div className="gridContainer">
					<DraggableContainer>
						<HeightAwareDataGrid
							onGridSort={this.handleGridSort}
							enableCellSelection={true}
							rowActionsCell={RowActionsCell}
							enableCellSelect={true}
							columns={this.columns}
							rows={this.rows}
							rowGetter={this.getRow}
							rowsCount={this.rows.length}
							onGridRowsUpdated={this.handleGridRowsUpdated}
							rowRenderer={<RowRenderer onRowDrop={this.reorderRows}/>}
							rowHeight={110}
							headerRowHeight={40}
							minColumnWidth={10}
							rowSelection={{
								showCheckbox: true,
								enableShiftSelect: true,
								onRowsSelected: this.onRowsSelected,
								onRowsDeselected: this.onRowsDeselected,
								selectBy: {
									keys: {rowKey: this.props.rowKey, values: this.selectedIds}
								}
							}}
						/>
					</DraggableContainer>
				</div>
			</div>
		);
	}
}));