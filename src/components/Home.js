import React from 'react';
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'

export default withRouter((props)=> {
	
	return (
		<div>
			<ul>
				<li><Link to="/classes">Classes</Link></li>
				<li><Link to="/decks">Decks</Link></li>
			</ul>
		</div>
	)
})