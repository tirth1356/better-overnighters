import { useMember, initials } from '@/lib/member';
import './member-switcher.css';

/**
 * Chooses which family member the medicine, vaccination and emergency screens
 * describe. The app shell only switches the signed-in *user*, so without this
 * every per-member screen would be stuck on the first relative in the family.
 */
export default function MemberSwitcher() {
  const { member, members, setMemberId } = useMember();
  if (members.length < 2) return null;

  return (
    <div className="member-switcher">
      <span className="member-switcher__label" id="member-switcher-label">Viewing</span>
      <div className="member-switcher__list" role="group" aria-labelledby="member-switcher-label">
        {members.map((m) => (
          <button
            key={m.id}
            type="button"
            className="member-switcher__chip"
            aria-pressed={m.id === member?.id}
            onClick={() => setMemberId(m.id)}
          >
            <span
              className="member-switcher__avatar"
              style={m.avatarColor ? { background: m.avatarColor, color: '#fff' } : undefined}
              aria-hidden="true"
            >
              {m.avatarInitials ?? initials(m.name)}
            </span>
            <span className="member-switcher__text">
              <span className="member-switcher__name">{m.name}</span>
              <span className="member-switcher__rel">{m.relationship ?? m.relation}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
