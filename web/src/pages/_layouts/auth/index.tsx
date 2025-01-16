import { Outlet } from 'react-router-dom'

import { ContainerAuth, ContainerRight, ContainerLeft, ContainerMain } from './styles'

export function AuthLayout() {
  return (
    <>
      <ContainerMain>
        <ContainerAuth variant={'secondary'} size={'full'}>
          <ContainerLeft>

          </ContainerLeft>
          <ContainerRight>
            <Outlet />
          </ContainerRight>
        </ContainerAuth>
        <footer>
          <span>lfqcamargo@gmail.com</span>
        </footer>
      </ContainerMain>

    </>
  )
}
