import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { Card, Badge, Icon, Avatar } from '../ui'
import { sportColor } from '../ui'
import { sportById } from '../../data/sports'
import type { Team } from '../../data/types'

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 14px;
`
const Name = styled.h3`
  font-size: ${(p) => p.theme.fontSize.lg};
  line-height: 1.15;
`
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
  margin-top: 3px;
  flex-wrap: wrap;
`
const Roles = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 14px 0;
`
const Foot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${(p) => p.theme.color.line};
  padding-top: 14px;
  margin-top: 4px;
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
`
const Go = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${(p) => p.theme.color.accent};
  font-weight: 600;
`
const levelTone = { agonistico: 'energy', amatoriale: 'accent', giovanile: 'volt' } as const

export function TeamCard({ team }: { team: Team }) {
  const sport = sportById(team.sport)
  const c = sportColor(team.sport)
  const openTotal = team.openRoles.reduce((n, r) => n + r.count, 0)
  return (
    <Card interactive pad={5}>
      <Head>
        <Avatar accent={c} size={46}>
          {sport.glyph}
        </Avatar>
        <div style={{ minWidth: 0 }}>
          <Name>{team.name}</Name>
          <Meta>
            <span>{sport.name}</span>·<span><Icon name="pin" size={13} /> {team.city}</span>
          </Meta>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Badge tone={levelTone[team.level]}>{team.level}</Badge>
        </div>
      </Head>

      <Roles>
        {team.openRoles.map((r) => (
          <Badge key={r.role} tone="neutral">
            {r.count}× {r.role}
          </Badge>
        ))}
        {openTotal === 0 && <Badge tone="neutral">Nessun ruolo aperto</Badge>}
      </Roles>

      <Foot>
        <span>
          <Icon name="users" size={14} /> {team.membersCount} tesserati · {team.federationId}
        </span>
        <Go to={`/app/squadre/${team.id}`}>
          Dettagli <Icon name="arrow-right" size={15} />
        </Go>
      </Foot>
    </Card>
  )
}
