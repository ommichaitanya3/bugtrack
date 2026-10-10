import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className='dashboard-header'>
      <Link className='brand' to='/'>BugTrack</Link>
      <div className='nav-user'>
        <span>{user?.name}</span>
        <button className='button-secondary' type='button' onClick={logout}>Log out</button>
      </div>
    </header>
  );
}
