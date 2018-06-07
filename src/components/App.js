import React, {Component} from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import Home from './Home';
import Classes from './Classes';
import Decks from './Decks';
import Deck from './Deck';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
} from 'reactstrap';
import CrumbRoute from './CrumbRoute';

class App extends Component {
	state = {};
	
	render() {
		return (
			<div className="App flex grow">
				<Navbar color="light" light expand="md">
					<NavbarBrand href="/">Sit Stand Think CMS</NavbarBrand>
					<NavbarToggler onClick={this.toggle}/>
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<NavLink><Link to="/classes">Classes</Link></NavLink>
							</NavItem><NavItem>
							<NavLink><Link to="/decks">Decks</Link></NavLink>
						</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
				{/*<Breadcrumbs className="breadcrumb"/>*/}
				<Switch>
					<Route exact path="/" component={Home}/>
					<CrumbRoute title="Classes" exact path="/classes" component={Classes}/>
					<CrumbRoute title="Decks" exact path="/decks" component={Decks}/>
					<CrumbRoute title="Deck" path="/deck/:deck_id" component={Deck}/>
				</Switch>
			</div>
		);
	}
}

export default App;

