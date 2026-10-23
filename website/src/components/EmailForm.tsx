import { ArrowRight } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { useT } from '../i18n';
import './EmailForm.css';

/**
 * The email box used in the hero and the final call to action.
 * It does not send anything yet: onJoin gets the email. Elios connects it to POST /api/waitlist/ later.
 */
export function EmailForm({ onDark = false, onJoin }: { onDark?: boolean; onJoin?: (email: string) => void }) {
  const t = useT();
  const [email, setEmail] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) onJoin?.(email);
  };
  return (
    <form className={`email-form ${onDark ? 'dark' : ''}`} onSubmit={submit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t({ sq: 'emaili@yt.com', en: 'you@email.com' })}
        aria-label={t({ sq: 'Emaili', en: 'Email' })}
      />
      <button className="btn" type="submit">
        {t({ sq: 'Më njofto', en: 'Notify me' })}
        <ArrowRight size={18} strokeWidth={2.2} />
      </button>
    </form>
  );
}
