import React from 'react';
import {withRouter} from 'react-router';
import {graphql, compose} from 'react-apollo'
import gql from "graphql-tag";
import {observer} from 'mobx-react';
import DataGrid from './DataGrid';
import {fields, query, upsertMutation, deleteMutation} from '../graphqlConfig/Classes';

export default compose(
	graphql(gql(query)),
	graphql(gql(deleteMutation), {name: 'deleteMutation'}),
	graphql(gql(upsertMutation), {name: 'upsertMutation'}),
)(withRouter(observer(class extends React.Component {
	render() {
		console.log("this.props", this.props);
		return (
			<DataGrid
				title="Classes"
				fields={fields}
				rowData={this.props.data.classes}
				{...this.props}
			/>
		);
	}
})));