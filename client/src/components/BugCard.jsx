const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export default function BugCard({ bug, onEdit, onDelete, deleting }) {
  const createdDate = new Date(bug.createdAt);
  const date = Number.isNaN(createdDate.getTime()) ? 'Unknown date' : dateFormatter.format(createdDate);

  return (
    <article className='bug-card'>
      <div className='bug-main'>
        <div className='bug-heading'>
          <h3>{bug.title}</h3>
          <span className={`status-badge status-${bug.status.toLowerCase().replaceAll(' ', '-')}`}>{bug.status}</span>
        </div>
        {bug.description && <p className='bug-description'>{bug.description}</p>}
        <div className='bug-meta'>
          <span className={`priority priority-${bug.priority.toLowerCase()}`}>{bug.priority} priority</span>
          <span>Created {date}</span>
        </div>
      </div>
      <div className='bug-actions'>
        <button className='text-button' type='button' onClick={() => onEdit(bug)}>Edit</button>
        <button className='text-button text-danger' type='button' onClick={() => onDelete(bug)} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </article>
  );
}
