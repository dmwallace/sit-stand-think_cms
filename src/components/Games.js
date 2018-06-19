import React from 'react';
import {withRouter} from 'react-router';
import {graphql, compose} from 'react-apollo'
import gql from "graphql-tag";
import {observer} from 'mobx-react';
import {query as poolsQuery} from '../graphqlConfig/Pools';
import {query as cardsQuery} from '../graphqlConfig/Cards';
import {query as classesQuery} from '../graphqlConfig/Classes';
import DataGrid from './DataGrid';
import {fields, query, upsertMutation, deleteMutation} from '../graphqlConfig/Games';


const options = (props) => {
	return {
		variables: {
			deck_id: props.match.params.deck_id
		}
	}
};

export default compose(
	graphql(gql(classesQuery), {options, name: 'classes'}),
	graphql(gql(query), {options, name: 'games'}),
	graphql(gql(poolsQuery), {options, name: 'pools'}),
	graphql(gql(cardsQuery), {options, name: 'cards'}),
	graphql(gql(deleteMutation), {name: 'deleteMutation'}),
	graphql(gql(upsertMutation), {name: 'upsertMutation'}),
)(withRouter(observer(class extends React.Component {
	
	componentWillReceiveProps(nextProps, nextContext) {
		////console.log("nextProps", nextProps);
		//this.forceUpdate();
	}
	
	render() {
		return (
			<DataGrid
				title="Games"
				fields={fields}
				rowData={this.props.games.games}
				{...this.props}
			/>
		);
	}
})));