import styled from '@emotion/styled'
import { Card, Badge, Icon, Avatar, Button } from '../ui'
import { SportChip } from '../ui'
import type { Sponsor } from '../../data/types'

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
`
const Name = styled.h3`
  font-size: ${(p) => p.theme.fontSize.lg};
`
const Cat = styled.div`
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
  margin-top: 2px;
`
const Desc = styled.p`
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
  margin: 10px 0 14px;
`
const Budget = styled.div`
  font-family: ${(p) => p.theme.font.display};
  font-weight: 800;
  font-size: 1.2rem;
  color: ${(p) => p.theme.color.fg};
`
const Wants = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
`
const Sports = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 12px 0 16px;
`
const tierTone = { local: 'accent', regionale: 'volt', nazionale: 'energy' } as const
const eur = (n: number) => n.toLocaleString('it-IT')

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Card pad={5}>
      <Head>
        <Avatar size={46}>{sponsor.name[0]}</Avatar>
        <div style={{ minWidth: 0 }}>
          <Name>{sponsor.name}</Name>
          <Cat>
            {sponsor.category} · {sponsor.city}
          </Cat>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Badge tone={tierTone[sponsor.tier]}>{sponsor.tier}</Badge>
        </div>
      </Head>

      <Budget>
        € {eur(sponsor.budgetMin)}–{eur(sponsor.budgetMax)}
        <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#9aa3b2' }}> / stagione</span>
      </Budget>

      <Desc>{sponsor.description}</Desc>

      <Sports>
        {sponsor.sports.slice(0, 4).map((s) => (
          <SportChip key={s} sport={s} />
        ))}
      </Sports>

      <Wants>
        {sponsor.wants.map((w) => (
          <Badge key={w} tone="neutral">
            {w}
          </Badge>
        ))}
      </Wants>

      <Button variant="secondary" full>
        <Icon name="send" size={16} /> Proponi la tua realtà
      </Button>
    </Card>
  )
}
