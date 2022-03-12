import { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

const logPageChange = (pathname, search = '', options) => {
  const page = pathname + search;
  const { location } = window;
  ReactGA.set({
    page,
    location: `${location.origin}${page}`,
    ...options
  });
  ReactGA.pageview(page);
};

function Analytics({ location, options }) {
  useEffect(() => {
    logPageChange(location.pathname, location.search, options);
  }, [location, options]);
  return null;
}

Analytics.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }).isRequired,
  options: PropTypes.object
};

export default Analytics;