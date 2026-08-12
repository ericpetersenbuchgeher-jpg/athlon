import '@emotion/react'
import type { AppTheme } from './theme'

// Make props.theme fully typed everywhere we use styled/ThemeProvider.
declare module '@emotion/react' {
  export interface Theme extends AppTheme {}
}
