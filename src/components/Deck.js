import React from 'react';
import {withRouter} from 'react-router';
import {Switch} from 'react-router-dom'
import {graphql, compose} from 'react-apollo'
import Header from './Header';
import Cards from './Cards';
import Pools from './Pools';
import Games from './Games';
import gql from "graphql-tag";
import CrumbRoute from './CrumbRoute';


export const fields = [
	{key: 'id', graphqlType: 'ID', editable: false, width: 100},
	{key: 'name', graphqlType: 'String', editable: true, width: 200},
	{key: 'description', graphqlType: 'String', editable: true},
	{key: 'order', graphqlType: 'Int', editable: false, width: 100},
];

const query = `
	query deck($id: ID){
		deck(id: $id) {
			${fields.map(({key}) => key).join(',\n')}
		}
	}
`;

const upsertMutation = `
	mutation upsertDeck(${fields.map(({key, graphqlType}) => `$${key}: ${graphqlType}`).join(',')}) {
		upsertDeck(${fields.map(({key}) => `${key}: $${key}`).join(',')}) {
			${fields.map(({key}) => key).join(',\n')}
		}
	}
`;

export default compose(
	graphql(gql(query), {
		options: props => {
			return {
				variables: {
					id: props.match.params.deck_id
				}
			}
		}
	}),
	graphql(gql(upsertMutation), {name: 'upsertMutation'}),
)(withRouter(class extends React.Component {
	render() {
		//console.log("this.props", this.props);
		
		let deck = this.props.data.deck;
		
		if (!deck) return null;
		
		
		return (
			<div className="flex grow">
				<Header>
					<h1>Deck: [{deck.id}] {deck.name}</h1>
				</Header>
				<Switch>
					<CrumbRoute title="Cards" path={`${this.props.match.path}/cards`} component={Cards}/>
					<CrumbRoute title="Pools" path={`${this.props.match.path}/pools`} component={Pools}/>
					<CrumbRoute title="Games" path={`${this.props.match.path}/games`} component={Games}/>
				</Switch>
			</div>
		);
	}
}));