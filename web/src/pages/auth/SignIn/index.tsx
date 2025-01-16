import { ContainerDiv, ContainerForm } from "./styles";
import { Button } from '@daro-ui/react'

export function SignIn() {
  return (
    <>
      <ContainerDiv>
        <ContainerForm>
          <form action="">
            <h2>Acessar Painel</h2>
            <span>Acompanhe seus reuniões</span>
            <div>
              <label htmlFor="">Seu email</label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">Sua senha</label>
              <input type="text" />
            </div>
            <div>
              <Button size={'sm'}>Acessar</Button>
            </div>

          </form>
        </ContainerForm>

      </ContainerDiv>

    </>
  )
}
