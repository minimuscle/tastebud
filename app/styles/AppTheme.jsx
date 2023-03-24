// importing the required chakra libraries
import { theme as chakraTheme, extendTheme } from '@chakra-ui/react'

const overrides = {
  ...chakraTheme.fonts,
  body: `"Poppins",sans-serif`,
  heading: `"Raleway",sans-serif`,
}

const AppTheme = extendTheme(overrides)

export default AppTheme
