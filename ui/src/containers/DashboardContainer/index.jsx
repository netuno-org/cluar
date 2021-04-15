import React, { Component } from "react";

import MyButton from "../../components/MyButton/index.jsx";

import "./index.less";

export default class DashboardContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0
        };
        this.button = React.createRef();
        this.click = this.click.bind(this);
    }

    componentWillMount() {
        /*
        // Basic sample of the service call:
        fetch('/services/my-test.netuno', {
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((json) => {
            // json...;
        });
        */
        
        /*
        // Better sample of the recommended way to call services:
        const fail = ()=> {
            this.setState({ loading: false });
            notification["error"]({
                message: 'Error',
                description: 'Data loading error...',
                style: {
                    marginTop: 100,
                }
            });
        };
        netuno.service({
            url: '/services/my-data-service',
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                param1: 'value1',
                param2: 'value2'
            }),
            success: (response)=> {
                console.log(response);
                if (response.json) {
                    this.setState({
                        loading: false,
                        data: response.json
                    });
                } else {
                    fail();
                }
            },
            fail: ()=> {
                fail();
            }
        });
        */
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        $(this.button.current).fadeOut(250).fadeIn(250);
    }

    click() {
        this.setState({ counter: this.state.counter + 1 });
    }

    render() {
        const { counter } = this.state;
        return (
            <div className="my-dashboard">
                <div className="my-dashboard__button">
                    <MyButton mainRef={ this.button } text={ `ReactJS ⚡ Ant.Design 👉 Click me! ${ counter }` } click={ this.click } />
                </div>
            </div>
        );
    }
}
