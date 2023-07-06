import { theme as chakraTheme, extendTheme, createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'
import { tabsAnatomy } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(tabsAnatomy.keys)

// define the base component styles
const baseStyle = definePartsStyle({
    // define the part you're going to style
    tab: {
        fontWeight: 'bold', // change the font weight
        color: 'red.400', // change the text color
    },
    tabpanel: {
        fontFamily: 'mono', // change the font family
    },
})

// export the component theme
const tabsTheme = defineMultiStyleConfig({ baseStyle })

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
        Tabs: tabsTheme
    },
}

const AppTheme = extendTheme(overrides)

export default AppTheme