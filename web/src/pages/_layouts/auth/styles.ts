import { Box, styled } from '@daro-ui/react'

export const ContainerMain = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
})

export const ContainerAuth = styled(Box, {
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  width: '100%'
})

export const ContainerLeft = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  width: '100%'
})

export const ContainerRight = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  width: '100%',
})

