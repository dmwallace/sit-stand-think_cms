import React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';

export default withRouter((props) => {
	//////console.log("props", props);
	
	return (
		<Link
			to={`${props.match.url}/${props.dependentValues.index}/cards`}
			style={{
				backgroundColor: 'white',
				height: '100px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-start',
				width: '100%',
				overflowX: 'auto',
			}}>
			{(() => {
				if (props.value && props.value.length) {
					return props.value.sort((a, b) => a.order - b.order).map((card) => {
						return (
							<div
								key={card.id}
								className={`item`}
								style={{
									height: '100%',
									flexShrink: 0,
									marginRight: '0.1rem',
									width: '60px',
								}}
							>
								<div
									style={{
										width: 'auto',
										backgroundImage: `url("${card.image}")`,
										backgroundRepeat: 'no-repeat',
										backgroundSize: 'contain',
										backgroundPosition: 'center',
										cursor: 'pointer',
										flexGrow: 1,
										margin: '0.1rem',
										backgroundColor: 'white'
									}}
								>
								
								</div>
								<div style={{
									backgroundColor: 'yellow',
									color: 'black',
									fontSize: '0.5rem',
								}}>{card.name}</div>
							</div>
						)
					});
				} else {
					return (
						<div style={{padding: '1em'}}>
							Click to add some cards
						</div>
					);
				}
			})()}
		</Link>
	)
});