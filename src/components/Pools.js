import React from 'react';
import {withRouter} from 'react-router';
import {graphql, compose} from 'react-apollo'
import gql from "graphql-tag";
import {observer} from 'mobx-react';
import DataGrid from './DataGrid';
import {fields, query, upsertMutation, deleteMutation} from '../graphqlConfig/Pools';

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
	
	componentWillReceiveProps(nextProps, nextContext) {
		this.forceUpdate();
	}
	
	render() {
		return (
			<DataGrid
				title="Pools"
				fields={fields}
				rowData={this.props.data.pools}
				{...this.props}
			/>
		);
	}
})));