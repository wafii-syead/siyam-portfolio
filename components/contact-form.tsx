'use client';
import { useRef, useState, type FormEvent } from 'react';
import { services } from '@/lib/content';
import { Icon } from './icons';

type Errors = Record<string, string>;
export function ContactForm({ service, onServiceChange }: { service: string; onServiceChange: (value: string) => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const requestId = useRef('');
  const formRef = useRef<HTMLFormElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!requestId.current) requestId.current = crypto.randomUUID();
    setStatus('sending'); setErrors({}); setMessage('Sending your brief…');
    const body = { ...Object.fromEntries(new FormData(form)), requestId: requestId.current };
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'omit', signal: AbortSignal.timeout(22000) });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setStatus('error'); setMessage(result.error || 'Your message could not be sent. Please try a social link.');
        setErrors(result.errors || {});
        const field = Object.keys(result.errors || {})[0];
        if (field) (form.elements.namedItem(field) as HTMLElement | null)?.focus();
        return;
      }
      setStatus('success'); setMessage(result.message); form.reset(); onServiceChange(''); requestId.current = '';
    } catch { setStatus('error'); setMessage('We could not confirm email acceptance. Your brief is still here. Please retry or use a social link.'); }
  }
  const fieldError = (name: string) => errors[name] ? <span className="field-error" id={`${name}-error`}>{errors[name]}</span> : null;
  return <form ref={formRef} className="contact-form" onSubmit={submit} aria-label="Project enquiry">
    <div className="form-heading"><span className="eyebrow">YOUR NEXT GOOD IDEA</span><h3>Tell me about it.</h3></div>
    <fieldset disabled={status === 'sending'}>
      <legend className="sr-only">Your project details</legend>
      <div className="form-row">
        <label>Your name <span aria-hidden="true">*</span><input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="What should I call you?" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />{fieldError('name')}</label>
        <label>Email address <span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />{fieldError('email')}</label>
      </div>
      <div className="form-row">
        <label>What are we creating? <span aria-hidden="true">*</span><select name="service" id="contact-service" required value={service} onChange={e => onServiceChange(e.target.value)} aria-invalid={!!errors.service} aria-describedby={errors.service ? 'service-error' : undefined}><option value="" disabled>Choose a service</option>{services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}<option value="other">Something else</option></select>{fieldError('service')}</label>
        <label>Budget <span className="optional">(optional)</span><input name="budget" maxLength={80} placeholder="Amount and currency, if known" aria-invalid={!!errors.budget} aria-describedby={errors.budget ? 'budget-error' : undefined} />{fieldError('budget')}</label>
      </div>
      <label>Your project brief <span aria-hidden="true">*</span><textarea name="message" required minLength={20} maxLength={5000} rows={5} placeholder="Your idea, your audience, and what you’d love to create…" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : 'message-hint'} />{fieldError('message')}</label>
      <span id="message-hint" className="form-hint">20–5,000 characters. Fields marked * are required.</span>
      <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button className="button dark full" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send project brief'}<Icon /></button>
    </fieldset>
    <p className="form-privacy">Your details are used to respond to this enquiry. Your message is sent by email and is not posted publicly.</p>
    <p className={`form-status ${status}`} role="status" aria-live="polite" aria-atomic="true">{message}</p>
  </form>;
}
