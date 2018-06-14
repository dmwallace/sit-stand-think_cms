import {query} from '../graphqlConfig/Cards';
import gql from "graphql-tag";
import {compose, graphql} from "react-apollo";
import {withRouter} from "react-router";
import React from "react";
import {observer} from "mobx-react";
import {observable} from 'mobx';
import {SelectableGroup, createSelectable, SelectAll, DeselectAll} from 'react-selectable-fast'
import {Button} from 'reactstrap';
import {apiUrl} from "../config";

//console.log("query", query);
export default compose(
	graphql(gql(query), {
		options: (props) => {
			return {
				variables: {
					deck_id: props.match.params.deck_id,
				}
			}
		}
	}),
)(withRouter(observer(class extends React.Component {
	@observable cardsInPool = this.props.selectedCards.reduce((cardsInPool, card) => {
		cardsInPool[card.id] = card;
		return cardsInPool;
	}, {});
	
	state = {};
	
	componentWillMount() {
		document.addEventListener("keydown", this.handleKeyDown);
	}
	
	
	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown);
	}
	
	handleKeyDown = (event) => {
		const enterKey = 13;
		const escapeKey = 27;
		
		switch (event.keyCode) {
			case escapeKey:
				this.onCancel();
				break;
			case enterKey:
				this.onSave();
				break;
		}
	}
	
	onSave = () => {
		this.props.onSelected(Object.values(this.cardsInPool))
		this.props.history.goBack();
	}
	
	onCancel = () => {
		console.log("click");
		
		
		this.props.history.goBack();
	};
	
	handleSelecting = selectingItems => {
		//console.log("selectingItems", selectingItems);
		
		
	}
	
	handleSelectionFinish = selectedItems => {
		this.cardsInPool = selectedItems.map((item) => item.props.card).reduce((cardsInPool, card) => {
			cardsInPool[card.id] = card;
			
			return cardsInPool;
		}, {});
	}
	
	handleSelectionClear() {
		//console.log('Cancel selection') // eslint-disable-line no-console
	}
	
	
	render() {
		//console.log("this.props.data", this.props.data);
		const {cards} = this.props.data;
		
		return (
			<div style={{
				position: 'absolute',
				top: '15px',
				bottom: '15px',
				left: '15px',
				right: '15px',
				backgroundColor: 'rgba(255,255,255,0.95)',
				border: '1px solid rgba(0,0,0,0.5)',
				zIndex: 9999,
				borderRadius: '5px',
				padding: '15px',
				display: 'flex',
				flexDirection: 'column',
			}}>
				<h1>{this.props.title || 'Select Cards'}</h1>
				<p>{Object.keys(this.cardsInPool).length} cards selected.</p>
				<SelectableGroup
					ref={ref => (window.selectableGroup = ref)}
					className="main"
					clickClassName="tick"
					enableDeselect
					tolerance={0}
					deselectOnEsc={false}
					allowClickWithoutSelected={true}
					duringSelection={this.handleSelecting}
					onSelectionClear={this.handleSelectionClear}
					onSelectionFinish={this.handleSelectionFinish}
				>
					
					<div className="cardsContainer">
						<div className="cards">
							{
								cards && cards.map((card) => {
									return (
										<SelectableCard key={card.id} card={card} selected={!!this.cardsInPool[card.id]}/>
									)
								})
							}
						</div>
					</div>
					
					
					<div style={{
						marginTop: '1rem',
						display: 'flex',
						position: 'relative',
						zIndex: 999999,
					}}>
						<div style={{
							display: 'flex',
							justifyContent: 'space-between',
							width: '100%',
						}}>
							<div style={{
								display: 'flex',
							}}>
								<SelectAll className="selectable-button">
									<Button outline color="primary" style={{marginRight: '0.5rem'}}>Select All</Button>
								</SelectAll>
								<DeselectAll className="selectable-button">
									<Button outline color="primary">Clear selection</Button>
								</DeselectAll>
							</div>
							
						</div>
					</div>
				</SelectableGroup>
				<div style={{
					position: 'absolute',
					right: 15,
					bottom: 15,
					zIndex: 1000000,
				}}>
					<Button color="primary" style={{marginRight: '0.5rem'}} onClick={this.onSave}>Save</Button>
					<Button color="secondary" onClick={this.onCancel}>Cancel</Button>
				</div>
			</div>
		
		)
	}
})));


const Card = ({
	              selectableRef, selected, selecting, card,
              }) => (
	<div
		ref={selectableRef}
		className={`
      item
      ${selecting && 'selecting'}
      ${selected && 'selected'}
    `}
	>
		<div
			style={{
				width: 'auto',
				backgroundImage: `url("${apiUrl}${card.image}")`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'contain',
				backgroundPosition: 'center',
				cursor: 'pointer',
				flexGrow: 1,
				margin: '0.25rem',
				backgroundColor: 'white'
			}}
		>
		
		</div>
		<div style={{
			backgroundColor: selected ? 'rebeccapurple' : 'yellow',
			color: selected ? 'white' : 'black',
			fontSize: '0.7rem',
		}}>{card.name}</div>
	</div>
)

const SelectableCard = createSelectable(Card);