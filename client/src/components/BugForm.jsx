import { useEffect, useState } from 'react';

const emptyBug = { title: '', description: '', priority: 'Medium', status: 'Open' };

export default function BugForm({ bug, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(emptyBug);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(bug ? {
      title: bug.title || '',
      description: bug.description || '',
      priority: bug.priority || 'Medium',
      status: bug.status || 'Open',
    } : emptyBug);
    setError('');
  }, [bug]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setError('');
    try {
      await onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save this bug. Please try again.');
    }
  };

  return (
    <form className='bug-form' onSubmit={submit}>
      <label htmlFor='bug-title'>Title</label>
      <input id='bug-title' name='title' value={form.title} onChange={updateField} maxLength={160} required />
      <label htmlFor='bug-description'>Description</label>
      <textarea id='bug-description' name='description' rows='4' value={form.description} onChange={updateField} />
      <div className='form-row'>
        <div>
          <label htmlFor='bug-priority'>Priority</label>
          <select id='bug-priority' name='priority' value={form.priority} onChange={updateField}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <div>
          <label htmlFor='bug-status'>Status</label>
          <select id='bug-status' name='status' value={form.status} onChange={updateField}>
            <option>Open</option><option>In Progress</option><option>Resolved</option>
          </select>
        </div>
      </div>
      {error && <p className='form-error' role='alert'>{error}</p>}
      <div className='form-actions'>
        <button type='button' className='button-secondary' onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type='submit' className='primary-button' disabled={submitting}>{submitting ? 'Saving…' : bug ? 'Save changes' : 'Create bug'}</button>
      </div>
    </form>
  );
}
