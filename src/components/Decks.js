import React from 'react';
import {withRouter} from 'react-router';
import {graphql, compose} from 'react-apollo'
import gql from "graphql-tag";
import {observer} from 'mobx-react';
import DataGrid from './DataGrid';
import {fields, extraColumns, query, upsertMutation, deleteMutation} from '../graphqlConfig/Decks';

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
		//console.log("this.props", this.props);
		return (
			<DataGrid
				title="Decks"
				fields={fields}
				extraColumns={extraColumns}
				rowData={this.props.data.decks}
				{...this.props}
			/>
		);
	}
})));