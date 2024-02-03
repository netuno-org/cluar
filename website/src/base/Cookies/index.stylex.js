import * as stylex from '@stylexjs/stylex';

const MEDIA_QUERY = '@media only screen and (max-width: 768px)';

const styles = stylex.create({
  container: {
    position: 'absolute',
    height: '100px',
    backgroundColor: '#777777'
  },
  popup: {
    position: 'fixed',
    zIndex: 10000,
    width: '100%',
    height: 'auto',
    bottom: 0,
    backgroundColor: '#ffffff',
    boxShadow: '0 -1px 10px 0 rgba(172, 171, 171, 0.3)'
  },
  content: {
    color: 'rgba(0, 0, 0, 0.85)',
    display: {
      default: 'flex',
      [MEDIA_QUERY]:'block'
    },
    justifyContent: 'space-between',
    padding: {
      default: '20px 50px',
      [MEDIA_QUERY]: '20px 20px'
    }
  },
  paragraph: {
    marginBottom: {
      default: 0,
      [MEDIA_QUERY]: '1em'
    }
  }
});

export default styles;
