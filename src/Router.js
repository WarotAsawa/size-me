import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Home from "./Home";
import VMSizer from "./VMSizer";
import ContainerSizer from "./ContainerSizer";
import history from './history';

export default class Routes extends Component {
	render() {
		return (
			<Router history={history}>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/vm-sizer" component={VMSizer} />
					<Route path="/container-sizer" component={ContainerSizer} />
				</Switch>
			</Router>
			)
	}
}