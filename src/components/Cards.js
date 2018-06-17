import React from 'react';
import {withRouter} from 'react-router';
import {graphql, compose} from 'react-apollo'
import gql from "graphql-tag";
import {observer} from 'mobx-react';
import DataGrid from './DataGrid';
import {fields, query, upsertMutation, deleteMutation} from '../graphqlConfig/Cards';
import Header from './Header';

export default compose(
	graphql(gql(query), {
		options: (props) => {
			return {
				variables: {
					deck_id: props.match.params.deck_id
				}
			}
		}
	}),
	graphql(gql(deleteMutation), {name: 'deleteMutation'}),
	graphql(gql(upsertMutation), {name: 'upsertMutation'}),
)(withRouter(observer(class extends React.Component {
	
	render() {
		console.log("this.props.data", this.props.data);
		return (
			<div className="flex grow">
				
				<DataGrid
					title="Cards"
					fields={fields}
					rowData={this.props.data.cards}
					{...this.props}
					toolbarComponent={({handleGridRowsUpdated}) => {
						return (
							<div style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center'
							}}>
								<label style={{margin: 0, marginRight: '1em'}} htmlFor="">Upload Multiple</label>
								<input
									type="file"
									multiple
									onChange={async ({target: {validity, files}}) => {
										for(const file of files) {
											await handleGridRowsUpdated({updated: {image: file}})
										}
									}}
								/>
							</div>
						)
					}}
				/>
			</div>
		);
	}
})));

