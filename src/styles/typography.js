import {Platform} from 'react-native';
import systemWeights from './helpers/systemWeights';
import robotoWeights from './helpers/robotoWeights';
import sanFranciscoSpacing from './helpers/sanFranciscoSpacing';
import theme from './theme';
// https://material.io/guidelines/style/typography.html#typography-styles

export default {
  display4: {
    fontSize: 112,
    lineHeight: 128,
    ...systemWeights.light,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(112) : undefined,
    color: theme.colors.text,
  },
  display3: {
    fontSize: 56,
    lineHeight: 64,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(56) : undefined,
    color: theme.colors.text,
  },
  display2: {
    fontSize: 45,
    lineHeight: 52,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(45) : undefined,
    color: theme.colors.text,
  },
  display1: {
    fontSize: 34,
    lineHeight: 40,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(34) : undefined,
    color: theme.colors.text,
  },
  headline: {
    fontSize: 24,
    lineHeight: 32,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(24) : undefined,
    color: theme.colors.text,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    ...systemWeights.semibold,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(20) : undefined,
    color: theme.colors.text,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(16) : undefined,
    color: theme.colors.text,
  },
  body2: {
    fontSize: 14,
    lineHeight: 24,
    ...systemWeights.semibold,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(14) : undefined,
    color: theme.colors.text,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(14) : undefined,
    color: theme.colors.text,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(12) : undefined,
    color: theme.colors.placeholder,
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    ...systemWeights.semibold,
    letterSpacing: Platform.OS === 'ios' ? sanFranciscoSpacing(14) : undefined,
    color: theme.colors.textLight,
    textTransform: Platform.OS === 'ios' ? 'uppercase' : undefined,
  },
};
