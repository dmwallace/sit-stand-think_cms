import {query as cardsQuery} from '../graphqlConfig/Cards';
import {query as poolsQuery} from '../graphqlConfig/Pools';
import gql from "graphql-tag";
import {compose, graphql} from "react-apollo";
import {withRouter} from "react-router";
import React from "react";
import {observer} from "mobx-react";
import {observable} from 'mobx';
import {SelectableGroup, createSelectable, SelectAll, DeselectAll} from 'react-selectable-fast'
import {Button} from 'reactstrap';
import {apiUrl} from "../config";
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

const options = (props) => {
	return {
		variables: {
			deck_id: props.match.params.deck_id
		}
	}
};

export default compose(
	graphql(gql(poolsQuery), {options, name: 'pools'}),
	graphql(gql(cardsQuery), {options, name: 'cards'}),
)(withRouter(observer(class extends React.Component {
	@observable cardsInPool = this.props.selectedCards.reduce((cardsInPool, card) => {
		cardsInPool[card.id] = card;
		return cardsInPool;
	}, {});
	
	@observable refreshToken;
	
	state = {};
	
	componentWillMount() {
		document.addEventListener("keydown", this.handleKeyDown);
	}
	
	
	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown);
	}
	
	cardsArrayToMap(arr) {
		return arr.reduce((cardsInPool, card) => {
			cardsInPool[card.id] = card;
			return cardsInPool;
		}, {});
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
		//console.log("click");
		
		
		this.props.history.goBack();
	};
	
	handleSelecting = selectingItems => {
		////console.log("selectingItems", selectingItems);
		
		
	}
	
	handleSelectionFinish = selectedItems => {
		this.cardsInPool = selectedItems.map((item) => item.props.card).reduce((cardsInPool, card) => {
			cardsInPool[card.id] = card;
			
			return cardsInPool;
		}, {});
	}
	
	handleSelectionClear() {
		////console.log('Cancel selection') // eslint-disable-line no-console
	}
	
	selectPool = (pool) => {
		this.refreshToken = Date.now();
		let cardsInPool = pool.cards.reduce((cardsInPool, card) => {
			cardsInPool[card.id] = card;
			return cardsInPool;
		}, {});
		
		////console.log("cardsInPool", cardsInPool);
		this.cardsInPool = cardsInPool;
	}
	
	render() {
		////console.log("this.props.data", this.props.data);
		//console.log("this.props", this.props);
		const {cards} = this.props.cards;
		const {pools} = this.props.pools;
		//console.log("this.cardsInPool", this.cardsInPool);
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
				<div style={{marginBottom: '0.5em', display: 'flex', alignItems: 'center'}}>
					<Dropdown
						side="sm"
						isOpen={this.state.dropdownOpen} toggle={() => {
						this.setState({dropdownOpen: !this.state.dropdownOpen});
					}}>
						<DropdownToggle caret>
							Load pool
						</DropdownToggle>
						<DropdownMenu>
							{
								pools.map((pool)=>{
									return (
										<DropdownItem key={pool.id} onClick={()=> this.selectPool(pool)}>{pool.name}</DropdownItem>
									)
								})
							}
						</DropdownMenu>
					</Dropdown>
				</div>
				<SelectableGroup
					key={this.refreshToken}
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
									let selected = !!this.cardsInPool[card.id];
									if(selected) {
										//console.log(`${card.name} is selected`);
										
										
									}
									return (
										<SelectableCard key={card.id} card={card} selected={selected}/>
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
					display: 'flex',
					alignItems: 'center',
				}}>
					<span style={{marginRight: '1rem'}}>{Object.keys(this.cardsInPool).length} cards selected</span>
					<Button color="primary" style={{marginRight: '0.5rem'}} onClick={this.onSave}>Save</Button>
					<Button color="secondary" onClick={this.onCancel}>Cancel</Button>
				</div>
			</div>
		
		);
	}
})));


const Card = ({
	              selectableRef, selected, selecting, card,
              }) => {
	
	//console.log(`rendering ${card.name}: selected: ${selected}`);
	
	
	return (
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
}

const SelectableCard = createSelectable(Card);