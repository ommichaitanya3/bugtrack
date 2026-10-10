const statuses = ['Open', 'In Progress', 'Resolved'];

export default function StatsCards({ stats }) {
  return (
    <section className='stats-grid' aria-label='Bug counts by status'>
      {statuses.map((status) => (
        <article className='stat-card' key={status}>
          <span className='stat-label'>{status}</span>
          <strong>{stats[status] ?? 0}</strong>
        </article>
      ))}
    </section>
  );
}
