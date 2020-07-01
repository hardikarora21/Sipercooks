import theme from './theme';
import Spacing from './spacing';

export default {
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  pageColumn: {
    marginLeft: Spacing.x2,
    marginRight: Spacing.x2,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch', // alignment of children along the secondary axis
    // (if the primary axis is row, then the secondary is column, and vice versa)
    justifyContent: 'flex-start',
  },

  pageColumnCentered: {
    marginLeft: Spacing.x2,
    marginRight: Spacing.x2,
    backgroundColor: theme.colors.background,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },

  // Row must be inside a column
  row: {
    flexDirection: 'row',
    alignItems: 'center', // in column axis center
    justifyContent: 'flex-start',
  },

  // Any other view if wrapped inside row - will itself be a column
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },

  // container will assign 1:0 width to it (Other items must be 0)
  // Must be wrapped in row or growRow
  growColumn: {
    flexGrow: 1,
  },

  growRow: {
    // container will assign 1:0 height to it (Other items must be 0)
    flexGrow: 1,
    // alignItems: 'stretch'
  },

  wrapFlex: {
    flexWrap: 'wrap',
  },

  selfStart: {
    alignSelf: 'flex-start',
  },

  contentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },

  selfCenter: {
    alignSelf: 'center',
    textAlign: 'center',
  },

  inputFieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center', // in column axis center
    justifyContent: 'flex-start',
    marginTop: Spacing.y3,
    marginBottom: Spacing.y3,
  },

  verticalMargin: {
    marginTop: Spacing.y9,
    marginBottom: Spacing.y3,
  },
};
