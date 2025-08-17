import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);
type Note = { id: string; text: string; done: boolean; createdAt?: string };

const client = generateClient({ authMode: 'apiKey' });

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.models.Note.list({ sortDirection: 'DESC', limit: 200 });
      setNotes((data ?? []) as Note[]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load notes';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function add(): Promise<void> {
    const val = text.trim();
    if (!val) return;
    setLoading(true);
    try {
      await client.models.Note.create({ text: val, done: false });
      setText('');
      await refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to add note';
      setError(msg);
      setLoading(false);
    }
  }

  async function toggle(note: Note): Promise<void> {
    setLoading(true);
    try {
      await client.models.Note.update({ id: note.id, done: !note.done });
      await refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update note';
      setError(msg);
      setLoading(false);
    }
  }

  async function remove(id: string): Promise<void> {
    setLoading(true);
    try {
      await client.models.Note.delete({ id });
      await refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete note';
      setError(msg);
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  const filtered = notes.filter(n => {
    if (filter === 'open') return !n.done;
    if (filter === 'done') return !!n.done;
    return true;
  });

  return (
    <main style={{ maxWidth: 760, margin: '2rem auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1>Notes App (TypeScript)</h1>

      <section style={{ display: 'grid', gap: 8 }}>
        <label style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="New note"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1, padding: 8 }}
            aria-label="New note text"
          />
          <button onClick={add} disabled={loading}>Add</button>
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <FilterButton value="all"   active={filter==='all'}   onClick={() => setFilter('all')}  />
          <FilterButton value="open"  active={filter==='open'}  onClick={() => setFilter('open')} />
          <FilterButton value="done"  active={filter==='done'}  onClick={() => setFilter('done')} />
          <button onClick={refresh} disabled={loading} title="Reload">↻ Refresh</button>
        </div>

        {loading && <div role="status">Loading…</div>}
        {error && <div role="alert" style={{ color: 'crimson' }}>{String(error)}</div>}
      </section>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
        {filtered.map((n) => (
          <li key={n.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span style={{ textDecoration: n.done ? 'line-through' : 'none' }}>{n.text}</span>
            <button onClick={() => toggle(n)} aria-label={n.done ? 'Mark as not done' : 'Mark as done'}>{n.done ? 'Undo' : 'Done'}</button>
            <button onClick={() => remove(n.id)} aria-label="Delete">Delete</button>
          </li>
        ))}
        {!loading && filtered.length === 0 && (
          <li style={{ color: '#666', padding: '12px 0' }}>No notes to show.</li>
        )}
      </ul>
    </main>
  );
}

type FilterKind = 'all' | 'open' | 'done';

function FilterButton({ value, active, onClick }: { value: FilterKind; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{ fontWeight: active ? 700 : 400 }}
    >
      {value[0].toUpperCase() + value.slice(1)}
    </button>
  );
}
