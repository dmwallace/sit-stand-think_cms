import React from 'react';

class HeightAware extends React.Component {
	state = {};
	
	componentDidMount() {
		////console.log("this.rootNode", this.rootNode);
		////console.log("this.rootNode.clientHeight", this.rootNode.clientHeight);
		this.updateHeight();
		
		window.addEventListener('resize', this.updateHeight);
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateHeight);
	}
	
	componentDidUpdate(prevProps, prevState, prevContext) {
		if(prevState.height !== this.state.height) {
			let target = document.getElementsByClassName('react-grid-Canvas')[0];
			target && (target.scrollTop += 1);
			target && (target.scrollTop -= 1);
		}
	}
	
	updateHeight = ()=>{
		this.setState({height: this.rootNode.clientHeight});
	}
	
	render() {
		return (
			<div style={{flexGrow: 1, backgroundColor: 'yellow'}} ref={node => this.rootNode = node}>
				{(()=>{
					if(!this.state.height) {
						return null;
					}
					let p = {
						...this.props, height: this.state.height, minHeight: this.state.height
					};
					
					return React.cloneElement(this.props.children, p);
				})()}
			</div>
		)
	}
}

const heightAware = (WrappedComponent) => (props)=> {
	return (
		<HeightAware {...props}>
			<WrappedComponent />
		</HeightAware>
	)
}

export default heightAware;