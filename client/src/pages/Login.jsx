import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className='auth-page'>
      <form className='auth-card' onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className='form-intro'>Log in to manage your bugs.</p>
        <label htmlFor='email'>Email</label>
        <input id='email' type='email' autoComplete='email' value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' autoComplete='current-password' value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className='form-error' role='alert'>{error}</p>}
        <button type='submit' disabled={submitting}>{submitting ? 'Logging in…' : 'Log in'}</button>
        <p className='form-footer'>No account? <Link to='/register'>Create one</Link></p>
      </form>
    </main>
  );
}
