// importing the required chakra libraries
import { theme as chakraTheme, extendTheme } from '@chakra-ui/react'

const overrides = {
  ...chakraTheme.fonts,
  body: `"Poppins",sans-serif`,
  heading: `"Raleway",sans-serif`,
  componentns: {
    Button: {
      variants: {
        'hard-shadow': {
          bg: 'red.400',
          boxShadow: '0 0 0 3px rgba(159, 122, 234, 0.6)',
        },
      },
    },
  },
}

const AppTheme = extendTheme(overrides)

export default AppTheme
