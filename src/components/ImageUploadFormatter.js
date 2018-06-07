import React from "react";

export default class extends React.Component {
	render() {
		return (
			<div style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'row',
				display: 'flex',
			}}>
				<input
					ref="fileInput"
					type="file"
					required
					style={{display: this.props.value ? 'none' : 'static'}}
					onChange={({target: {validity, files: [file]}}) => {
						//console.log("file", file);
						this.props.onChange({
							fromRow: this.props.dependentValues.index,
							toRow: this.props.dependentValues.index,
							updated: {
								image: file
							}
						})
					}}
				/>
				{this.props.value ?
					<img src={this.props.value} alt="this.props.value" style={{height: '100px'}} onClick={() => {
						//console.log("yoo");
						//console.log("this.refs.fileInput", this.refs.fileInput);
						this.refs.fileInput && this.refs.fileInput.click();
						
					}}/> : null}
			</div>
		)
	}
}