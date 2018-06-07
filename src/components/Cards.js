import React from 'react';
import {withRouter} from 'react-router';
import {graphql, compose} from 'react-apollo'
import gql from "graphql-tag";
import {observer} from 'mobx-react';
import DataGrid from './DataGrid';
import {fields, query, upsertMutation, deleteMutation} from '../graphqlConfig/Cards';

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
			<DataGrid
				title="Cards"
				fields={fields}
				rowData={this.props.data.cards}
				{...this.props}
			/>
		);
	}
})));