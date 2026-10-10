import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import BugCard from '../components/BugCard';
import BugForm from '../components/BugForm';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';

const emptyStats = { Open: 0, 'In Progress': 0, Resolved: 0 };

export default function Dashboard() {
  const [bugs, setBugs] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [status, setStatus] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [formBug, setFormBug] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadStats = useCallback(async (signal) => {
    const { data } = await api.get('/bugs/stats', { signal });
    setStats({ ...emptyStats, ...data });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setPageError('');
    const params = {};
    if (status !== 'All') params.status = status;
    if (search) params.search = search;

    Promise.all([
      api.get('/bugs', { params, signal: controller.signal }),
      loadStats(controller.signal),
    ])
      .then(([{ data }]) => setBugs(data))
      .catch((error) => {
        if (error.code !== 'ERR_CANCELED') {
          setPageError(error.response?.data?.message || 'Could not load bugs. Please try again.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [status, search, refresh, loadStats]);

  const saveBug = async (values) => {
    setSubmitting(true);
    try {
      if (formBug) await api.put(`/bugs/${formBug._id}`, values);
      else await api.post('/bugs', values);
      setFormOpen(false);
      setFormBug(null);
      setRefresh((value) => value + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBug = async (bug) => {
    if (!window.confirm(`Delete “${bug.title}”? This cannot be undone.`)) return;
    setDeletingId(bug._id);
    setPageError('');
    try {
      await api.delete(`/bugs/${bug._id}`);
      setRefresh((value) => value + 1);
    } catch (error) {
      setPageError(error.response?.data?.message || 'Could not delete this bug. Please try again.');
    } finally {
      setDeletingId('');
    }
  };

  const openCreate = () => {
    setFormBug(null);
    setFormOpen(true);
  };

  const openEdit = (bug) => {
    setFormBug(bug);
    setFormOpen(true);
  };

  return (
    <main className='dashboard'>
      <Navbar />
      <section className='dashboard-intro'>
        <div>
          <p className='eyebrow'>BugTrack workspace</p>
          <h1>Bug dashboard</h1>
          <p className='dashboard-subtitle'>Track issues and keep your work moving.</p>
        </div>
        <button className='primary-button create-button' type='button' onClick={openCreate}>+ New bug</button>
      </section>

      <StatsCards stats={stats} />

      <section className='bug-section'>
        <div className='section-heading'>
          <div>
            <h2>Your bugs</h2>
            <p>Review and update your tracked issues.</p>
          </div>
        </div>
        <div className='bug-filters'>
          <label className='search-field'>
            <span className='sr-only'>Search bugs by title</span>
            <input type='search' placeholder='Search by title…' value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
          </label>
          <label className='filter-field'>
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>All</option><option>Open</option><option>In Progress</option><option>Resolved</option>
            </select>
          </label>
        </div>

        {pageError && <div className='page-error' role='alert'>{pageError}<button type='button' onClick={() => setRefresh((value) => value + 1)}>Retry</button></div>}
        {loading ? <p className='state-message'>Loading your bugs…</p> : bugs.length === 0 ? (
          <div className='empty-state'>
            <h3>No bugs found</h3>
            <p>{search || status !== 'All' ? 'Try changing your search or filter.' : 'Create your first bug to get started.'}</p>
            {!search && status === 'All' && <button className='primary-button' type='button' onClick={openCreate}>Create a bug</button>}
          </div>
        ) : (
          <div className='bug-list'>
            {bugs.map((bug) => <BugCard key={bug._id} bug={bug} onEdit={openEdit} onDelete={deleteBug} deleting={deletingId === bug._id} />)}
          </div>
        )}
      </section>

      {formOpen && (
        <div className='modal-backdrop' role='presentation' onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) setFormOpen(false); }}>
          <section className='form-modal' role='dialog' aria-modal='true' aria-labelledby='bug-form-heading'>
            <div className='modal-heading'>
              <h2 id='bug-form-heading'>{formBug ? 'Edit bug' : 'Create a bug'}</h2>
              <button className='modal-close' type='button' aria-label='Close form' onClick={() => setFormOpen(false)} disabled={submitting}>×</button>
            </div>
            <BugForm bug={formBug} onSubmit={saveBug} onCancel={() => setFormOpen(false)} submitting={submitting} />
          </section>
        </div>
      )}
    </main>
  );
}
