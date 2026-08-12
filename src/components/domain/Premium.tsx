import styled from '@emotion/styled'
import type { ReactNode } from 'react'
import { Badge, ButtonLink, Card, Icon } from '../ui'
import { useAuth } from '../../auth/AuthContext'

// Freemium building blocks: badge del piano, card di upsell e "gate" che sfuma
// una feature riservata a Premium (5 €/mese) quando l'utente è sul piano free.

export function PlanBadge() {
  const { plan } = useAuth()
  return plan === 'premium' ? (
    <Badge tone="volt">
      <Icon name="crown" size={12} /> Premium
    </Badge>
  ) : (
    <Badge tone="neutral">Piano Gratis</Badge>
  )
}

const UpsellWrap = styled(Card)`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  background:
    radial-gradient(130% 160% at 0% 0%, rgba(200, 255, 77, 0.12), transparent 55%),
    ${(p) => p.theme.color.bg2};
  border-color: rgba(200, 255, 77, 0.25);
  .ic {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    color: ${(p) => p.theme.color.volt};
    background: rgba(200, 255, 77, 0.12);
    flex: 0 0 auto;
  }
  .tx {
    flex: 1;
    min-width: 220px;
  }
  strong {
    display: block;
    margin-bottom: 2px;
  }
  span {
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.small};
  }
`

export function UpsellCard({ text }: { text?: string }) {
  const { plan } = useAuth()
  if (plan === 'premium') return null
  return (
    <UpsellWrap pad={5}>
      <span className="ic">
        <Icon name="crown" size={20} />
      </span>
      <div className="tx">
        <strong>Passa a Premium — 5 €/mese</strong>
        <span>
          {text ??
            'Avvisi automatici sulle scadenze, candidature e proposte illimitate, statistiche e squadra senza limiti.'}
        </span>
      </div>
      <ButtonLink to="/app/premium" variant="energy" size="sm">
        Scopri Premium <Icon name="arrow-right" size={14} />
      </ButtonLink>
    </UpsellWrap>
  )
}

const GateWrap = styled.div`
  position: relative;
  border-radius: ${(p) => p.theme.radius.md};
  overflow: hidden;
  .locked-content {
    filter: blur(4px) saturate(0.7);
    opacity: 0.55;
    pointer-events: none;
    user-select: none;
  }
  .lock-layer {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-align: center;
    padding: 20px;
    background: rgba(7, 9, 13, 0.35);
    .lock-ic {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      color: ${(p) => p.theme.color.volt};
      background: rgba(200, 255, 77, 0.14);
      border: 1px solid rgba(200, 255, 77, 0.3);
    }
    strong {
      font-size: ${(p) => p.theme.fontSize.body};
    }
    span {
      color: ${(p) => p.theme.color.fgMuted};
      font-size: ${(p) => p.theme.fontSize.small};
      max-width: 40ch;
    }
  }
`

/** Wrappa una feature Premium: per gli utenti free la sfuma e mostra il lucchetto + CTA. */
export function PremiumGate({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  const { plan } = useAuth()
  if (plan === 'premium') return <>{children}</>
  return (
    <GateWrap>
      <div className="locked-content" aria-hidden="true">
        {children}
      </div>
      <div className="lock-layer">
        <span className="lock-ic">
          <Icon name="lock" size={18} />
        </span>
        <strong>{title}</strong>
        {hint && <span>{hint}</span>}
        <ButtonLink to="/app/premium" variant="energy" size="sm">
          Sblocca con Premium — 5 €/mese
        </ButtonLink>
      </div>
    </GateWrap>
  )
}
