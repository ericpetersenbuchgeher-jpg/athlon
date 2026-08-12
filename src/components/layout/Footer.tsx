import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { Container, Logo, Muted } from '../ui'
import { BRAND } from '../../brand'

const Wrap = styled.footer`
  position: relative;
  z-index: ${(p) => p.theme.z.content};
  border-top: 1px solid ${(p) => p.theme.color.line};
  background: rgba(6, 8, 13, 0.72);
  backdrop-filter: blur(6px);
  padding: ${(p) => p.theme.space(14)} 0 ${(p) => p.theme.space(8)};
`

const Cols = styled.div`
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: ${(p) => p.theme.space(8)};
  @media (max-width: 780px) {
    grid-template-columns: 1fr 1fr;
  }
`

const Col = styled.div`
  h4 {
    font-family: ${(p) => p.theme.font.body};
    font-size: ${(p) => p.theme.fontSize.micro};
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: ${(p) => p.theme.color.fgFaint};
    margin: 0 0 ${(p) => p.theme.space(4)};
  }
  a,
  span {
    display: block;
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.small};
    padding: 5px 0;
    transition: color 0.16s;
  }
  a:hover {
    color: ${(p) => p.theme.color.fg};
  }
`

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.space(3)};
  margin-top: ${(p) => p.theme.space(10)};
  padding-top: ${(p) => p.theme.space(6)};
  border-top: 1px solid ${(p) => p.theme.color.line};
  color: ${(p) => p.theme.color.fgFaint};
  font-size: ${(p) => p.theme.fontSize.small};
`

export function Footer() {
  return (
    <Wrap>
      <Container>
        <Cols>
          <Col>
            <Logo />
            <Muted style={{ marginTop: 16, maxWidth: 280 }}>{BRAND.claim}</Muted>
          </Col>
          <Col>
            <h4>Prodotto</h4>
            <a href="/#societa">Crea una società</a>
            <a href="/#squadre">Trova una squadra</a>
            <a href="/#sponsor">Trova sponsor</a>
            <Link to="/sport">Tutti gli sport</Link>
          </Col>
          <Col>
            <h4>Risorse</h4>
            <span>Guida al tesseramento</span>
            <span>Federazioni ed enti</span>
            <span>Modelli statuto ASD</span>
            <span>Assistenza</span>
          </Col>
          <Col>
            <h4>Legale</h4>
            <span>Privacy</span>
            <span>Termini</span>
            <span>Cookie</span>
          </Col>
        </Cols>
        <Bottom>
          <span>
            © 2026 {BRAND.name} — {BRAND.domain}
          </span>
          <span>Fatto in Italia 🇮🇹 · demo</span>
        </Bottom>
      </Container>
    </Wrap>
  )
}
