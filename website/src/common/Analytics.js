import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { Route } from 'react-router-dom';

import config from '../config/config';

class Analytics extends Component {
	componentDidMount() {
		this.logPageChange(
			this.props.location.pathname,
			this.props.location.search
		);
	}

	componentDidUpdate({ location: prevLocation }) {
		const { location: { pathname, search } } = this.props;
		const isDifferentPathname = pathname !== prevLocation.pathname;
		const isDifferentSearch = search !== prevLocation.search;

		if (isDifferentPathname || isDifferentSearch) {
			this.logPageChange(pathname, search);
		}
	}

	logPageChange(pathname, search = '') {
		const page = pathname + search;
		const { location } = window;
		ReactGA.set({
			page,
			location: `${location.origin}${page}`,
			...this.props.options
		});
		ReactGA.pageview(page);
	}

	render () {
		return null;
	}

	static RouteTracker() {
		return <Route component={Analytics} />;
	}

	static init(options = {}) {
		let isGAEnabled = false;
		if (config.analytics && config.analytics !== ''){
			ReactGA.initialize(config.analytics);
			isGAEnabled = true;
		}
		return isGAEnabled;
	};
}

Analytics.propTypes = {
	location: PropTypes.shape({
		pathname: PropTypes.string,
		search: PropTypes.string
	}).isRequired,
	options: PropTypes.object
};

export default Analytics;