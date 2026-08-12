import styled from '@emotion/styled'
import { ButtonLink, Logo, Icon } from '../components/ui'

const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 40px;
  background:
    radial-gradient(90% 70% at 50% 0%, ${(p) => p.theme.color.accentSoft}, transparent 55%),
    ${(p) => p.theme.color.bg};
`
const Big = styled.div`
  font-family: ${(p) => p.theme.font.display};
  font-weight: 800;
  font-size: clamp(5rem, 20vw, 12rem);
  line-height: 0.9;
  background: linear-gradient(120deg, #ff6b3d, #4f83ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 20px 0 4px;
`

export function NotFoundPage() {
  return (
    <Wrap>
      <div>
        <Logo />
        <Big>404</Big>
        <h1 style={{ marginBottom: 12 }}>Fuori campo</h1>
        <p style={{ color: '#9aa3b2', maxWidth: '40ch', margin: '0 auto 26px' }}>
          La pagina che cerchi non esiste o è stata spostata. Torna in campo.
        </p>
        <ButtonLink to="/" variant="primary" size="lg">
          <Icon name="arrow-right" size={18} style={{ transform: 'rotate(180deg)' }} /> Torna alla home
        </ButtonLink>
      </div>
    </Wrap>
  )
}
