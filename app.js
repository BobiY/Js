
import React from "react";
import { render } from "react-dom";
import Uxcore from "uxcore";
import Tables from "./app/component/table";


let {Dialog} = Uxcore;

class Demo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
			content:"dasdadad"
        };
    }
    show() {
        this.setState({
          visible: true
        });
    }
	edit(content){
		console.log(content)
		this.setState({
			content:content.peerName
		})
	}
    render(){
        return (
            <div>
			    <Tables show = {this.show.bind(this)} edit = {this.edit.bind(this)}></Tables>
                <Dialog title="第一个 Dialog"
                    visible={this.state.visible}
                    onOk={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}>
                    	{this.state.content}
                </Dialog>
            </div>
        );
    }
}

render(<Demo />, document.getElementById('app'))
