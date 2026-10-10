import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Complete all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className='auth-page'>
      <form className='auth-card' onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className='form-intro'>Get started with BugTrack.</p>
        <label htmlFor='name'>Name</label>
        <input id='name' type='text' autoComplete='name' value={name} onChange={(event) => setName(event.target.value)} required />
        <label htmlFor='email'>Email</label>
        <input id='email' type='email' autoComplete='email' value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' autoComplete='new-password' minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className='form-error' role='alert'>{error}</p>}
        <button type='submit' disabled={submitting}>{submitting ? 'Creating account…' : 'Register'}</button>
        <p className='form-footer'>Already registered? <Link to='/login'>Log in</Link></p>
      </form>
    </main>
  );
}
