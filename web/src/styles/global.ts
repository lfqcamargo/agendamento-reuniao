import { globalCss } from '@daro-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    width: '100%',
    height: '100%',
  },
})
