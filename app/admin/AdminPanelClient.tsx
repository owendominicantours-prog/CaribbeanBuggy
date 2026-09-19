'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { AdminRecord, AdminRecordStatus } from '../../lib/adminStore';
import type { SeoInventoryItem, SeoInventoryType } from '../../lib/seoInventory';
import type { VisitSnapshot } from '../../lib/visitStore';

type AdminPanelClientProps = {
  initialRecords: AdminRecord[];
  initialSeoPages: SeoInventoryItem[];
  initialVisits: VisitSnapshot;
  recordsPersistent: boolean;
};

const seoTypeLabels: Record<SeoInventoryType, string> = { principal: 'Principal', producto: 'Producto', pregunta: 'Pregunta', guia: 'Guía', hotel: 'Hotel', busqueda: 'Búsqueda SEO' };

const statusLabels: Record<AdminRecordStatus, string> = {
  pending_payment: 'Pago pendiente',
  paid: 'Pagada',
  inquiry: 'Consulta',
  contacted: 'Contactado',
  completed: 'Completada',
  cancelled: 'Cancelada',
  capture_failed: 'Pago fallido',
};

const statusOptions: AdminRecordStatus[] = [
  'pending_payment',
  'paid',
  'inquiry',
  'contacted',
  'completed',
  'cancelled',
  'capture_failed',
];

function money(value?: number) {
  if (!value && value !== 0) return '-';
  return `US$${value.toFixed(2)}`;
}

function formatDate(value?: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return '-';
  const options: Intl.DateTimeFormatOptions = value.includes('T')
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' };

  return new Intl.DateTimeFormat('es-DO', options).format(new Date(value.includes('T') ? value : value + 'T12:00:00'));
}

function whatsappLink(phone?: string) {
  const digits = (phone || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

export default function AdminPanelClient({ initialRecords, initialSeoPages, initialVisits, recordsPersistent }: AdminPanelClientProps) {
  const [records, setRecords] = useState(initialRecords);
  const [activePanel, setActivePanel] = useState<'operations' | 'seo'>('operations');
  const [period, setPeriod] = useState('upcoming');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [product, setProduct] = useState('');
  const [kind, setKind] = useState('all');
  const [draft, setDraft] = useState<AdminRecord | null>(null);
  const editorRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!draft) return;
    editorRef.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [draft?.id]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santo_Domingo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const weekEnd = new Date(Date.parse(today + 'T12:00:00Z') + 6 * 86400000).toISOString().slice(0,10);
  const active = (r: AdminRecord) => r.status !== 'cancelled' && r.status !== 'completed';
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminRecordStatus>('all');
  const [savingId, setSavingId] = useState('');
  const [seoQuery, setSeoQuery] = useState('');
  const [seoType, setSeoType] = useState<'all' | SeoInventoryType>('all');
  const [seoLocale, setSeoLocale] = useState<'all' | 'es' | 'en'>('all');
  const [seoDestination, setSeoDestination] = useState<'all' | SeoInventoryItem['destination']>('all');
  const [seoSort, setSeoSort] = useState<'visits' | 'today' | 'title'>('visits');
  const [seoLimit, setSeoLimit] = useState(100);
  const [visits, setVisits] = useState(initialVisits);
  const [refreshingVisits, setRefreshingVisits] = useState(false);

  const filteredRecords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const haystack = [
        record.reference,
        record.orderId,
        record.productName,
        record.customer.name,
        record.customer.email,
        record.customer.phone,
        record.booking.hotel,
        record.booking.pickupZone,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const date = record.booking.date?.slice(0,10) || '';
      const matchesPeriod = period === 'all' || (period === 'missing' ? !date : period === 'past' ? !!date && date < today : active(record) && !!date && (period === 'today' ? date === today : period === 'week' ? date >= today && date <= weekEnd : date >= today));
      return matchesStatus && matchesPeriod && (!product || record.productName === product) && (kind === 'all' || record.type === kind) && (!from || date >= from) && (!to || (!!date && date <= to)) && (!needle || haystack.includes(needle));
    }).sort((a,b) => (a.booking.date || '9999').localeCompare(b.booking.date || '9999') || (a.booking.pickupWindow || '').localeCompare(b.booking.pickupWindow || ''));
  }, [query, records, statusFilter, period, from, to, product, kind, today, weekEnd]);

  const summary = useMemo(
    () => ({
      total: records.length,
      paid: records.filter((record) => record.status === 'paid').length,
      pending: records.filter((record) => record.status === 'pending_payment').length,
      inquiries: records.filter((record) => record.type === 'inquiry').length,
    }),
    [records],
  );

  const seoPages = useMemo(() => {
    const needle = seoQuery.trim().toLowerCase();
    return initialSeoPages
      .filter((page) => (seoType === 'all' || page.type === seoType) && (seoLocale === 'all' || page.locale === seoLocale) && (seoDestination === 'all' || page.destination === seoDestination) && (!needle || `${page.title} ${page.path}`.toLowerCase().includes(needle)))
      .sort((a, b) => {
        if (seoSort === 'title') return a.title.localeCompare(b.title);
        const key = seoSort === 'today' ? 'today' : 'visits';
        return (visits.metrics[b.path]?.[key] ?? 0) - (visits.metrics[a.path]?.[key] ?? 0);
      });
  }, [initialSeoPages, seoDestination, seoLocale, seoQuery, seoSort, seoType, visits]);

  const seoSummary = useMemo(() => ({
    pages: initialSeoPages.length,
    views: Object.values(visits.metrics).reduce((total, metric) => total + metric.views, 0),
    visits: Object.values(visits.metrics).reduce((total, metric) => total + metric.visits, 0),
    today: Object.values(visits.metrics).reduce((total, metric) => total + metric.today, 0),
    visitedPages: initialSeoPages.filter((page) => (visits.metrics[page.path]?.views ?? 0) > 0).length,
  }), [initialSeoPages, visits]);

  async function changeStatus(id: string, status: AdminRecordStatus) {
    setSavingId(id);
    setError('');
    setNotice('');

    try {
      const response = await fetch(`/api/admin/records/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: `Estado cambiado a ${statusLabels[status]}` }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || 'No se pudo actualizar el registro.');
      }

      const updated = (await response.json()) as AdminRecord;
      setRecords((current) => current.map((record) => (record.id === updated.id ? updated : record)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar.');
    } finally {
      setSavingId('');
    }
  }

  async function saveDetails(event: React.FormEvent) {
    event.preventDefault();
    if (!draft || savingId) return;
    setSavingId(draft.id); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/admin/records/${encodeURIComponent(draft.id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: draft.customer, booking: { date: draft.booking.date || '', pickupWindow: draft.booking.pickupWindow || '', hotel: draft.booking.hotel || '', pickupZone: draft.booking.pickupZone || '', language: draft.booking.language || '' }, note }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo guardar.');
      setRecords(rows => rows.map(r => r.id === data.id ? data : r));
      setDraft(null); setNotice('Reserva actualizada correctamente.');
    } catch(e) { setError(e instanceof Error ? e.message : 'No se pudo guardar.'); }
    finally { setSavingId(''); }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  async function reconcilePayment(record: AdminRecord) {
    setSavingId(record.id); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/admin/records/${encodeURIComponent(record.id)}/reconcile`, { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo verificar PayPal.');
      if (result.status !== 'paid') throw new Error('El pago todavía no está conciliado.');
      setRecords(rows => rows.map(r => r.id === record.id ? { ...r, status: 'paid' } : r));
      setNotice('PayPal confirmó el pago y la reserva está pagada. No se realizó otro cobro.');
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo verificar PayPal.'); }
    finally { setSavingId(''); }
  }

  async function refreshVisits() {
    setRefreshingVisits(true);
    try {
      const response = await fetch('/api/admin/visits', { cache: 'no-store' });
      if (response.ok) setVisits(await response.json() as VisitSnapshot);
    } finally { setRefreshingVisits(false); }
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <span>Caribbean Buggy</span>
          <h1>{activePanel === 'operations' ? 'Reservas y consultas' : 'SEO y visitas propias'}</h1>
          <p>{activePanel === 'operations' ? 'Control operativo para pagos PayPal, consultas por WhatsApp y solicitudes pendientes.' : 'Inventario de las 1,000 páginas canónicas y contador interno de tráfico por URL.'}</p>
        </div>
        <button type="button" onClick={logout}>
          Cerrar sesion
        </button>
      </header>

      <nav className="admin-panel-tabs" aria-label="Secciones del administrador">
        <button type="button" className={activePanel === 'operations' ? 'active' : ''} onClick={() => setActivePanel('operations')}>Reservas</button>
        <button type="button" className={activePanel === 'seo' ? 'active' : ''} onClick={() => setActivePanel('seo')}>SEO y visitas <b>{initialSeoPages.length}</b></button>
      </nav>

      {activePanel === 'operations' ? <>
      <section className={`admin-storage-banner ${recordsPersistent ? 'persistent' : 'temporary'}`}>
        <div><b>{recordsPersistent ? 'Base de reservas permanente activa' : 'Almacenamiento temporal'}</b><span>{recordsPersistent ? 'Las reservas y consultas se conservan entre despliegues y reinicios de Vercel.' : 'Configura DATABASE_URL para conservar reservas entre despliegues.'}</span></div>
      </section>
      <section className="admin-stat-grid">
        <article>
          <span>Total</span>
          <strong>{summary.total}</strong>
        </article>
        <article>
          <span>Pagadas</span>
          <strong>{summary.paid}</strong>
        </article>
        <article>
          <span>Pendientes</span>
          <strong>{summary.pending}</strong>
        </article>
        <article>
          <span>Consultas</span>
          <strong>{summary.inquiries}</strong>
        </article>
      </section>

      <section className="admin-stat-grid">
        <article><span>Servicios hoy</span><strong>{records.filter(r => active(r) && r.type === 'booking' && r.booking.date === today).length}</strong></article>
        <article><span>Servicios en 7 días</span><strong>{records.filter(r => active(r) && r.type === 'booking' && r.booking.date && r.booking.date >= today && r.booking.date <= weekEnd).length}</strong></article>
        <article><span>Sin fecha</span><strong>{records.filter(r => active(r) && !r.booking.date).length}</strong></article>
      </section>
      {error && !draft && <p role="alert" className="admin-feedback error">{error}</p>}
      {notice && <p role="status" className="admin-feedback">{notice}</p>}
      <section className="admin-toolbar admin-operation-filters">
        <label>Periodo<select aria-label="Periodo" value={period} onChange={e => setPeriod(e.target.value)}>{[['upcoming','Próximas'],['today','Hoy'],['week','Próximos 7 días'],['all','Todas'],['past','Pasadas'],['missing','Sin fecha']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label>Tipo<select aria-label="Tipo" value={kind} onChange={e => setKind(e.target.value)}><option value="all">Reservas y consultas</option><option value="booking">Reservas</option><option value="inquiry">Consultas</option></select></label>
        <label>Servicio<select aria-label="Servicio" value={product} onChange={e => setProduct(e.target.value)}><option value="">Todos los servicios</option>{[...new Set(records.map(r => r.productName).filter(Boolean))].map(name => <option key={name} value={name}>{name}</option>)}</select></label>
        <label>Desde<input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
        <label>Hasta<input type="date" min={from} value={to} onChange={e => setTo(e.target.value)} /></label>
        <button type="button" onClick={() => { setQuery(''); setStatusFilter('all'); setPeriod('all'); setKind('all'); setProduct(''); setFrom(''); setTo(''); }}>Limpiar filtros</button>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por cliente, hotel, producto, correo o codigo"
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminRecordStatus)}>
          <option value="all">Todos los estados</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </section>

      <p>{filteredRecords.length} registros encontrados</p>
      {!filteredRecords.length && <p className="admin-feedback">No hay reservas para estos filtros. Selecciona Todas o Sin fecha para revisar otros registros.</p>}
      <section className="admin-record-grid">
        {filteredRecords.map((record) => {
          const wa = whatsappLink(record.customer.phone);
          return (
            <article className="admin-record-card" key={record.id}>
              <div className="admin-record-head">
                <div>
                  <span>{record.type === 'booking' ? 'Reserva' : 'Consulta'}</span>
                  <h2>{record.productName || 'Servicio buggy'}</h2>
                </div>
                <strong className={`admin-status admin-status-${record.status}`}>{statusLabels[record.status]}</strong>
              </div>

              <div className="admin-record-code">
                <b>{record.reference || record.id}</b>
                <small>{formatDate(record.createdAt)}</small>
              </div>

              <div className="admin-record-columns">
                <div>
                  <span>Cliente</span>
                  <b>{record.customer.name || '-'}</b>
                  <small>{record.customer.email || '-'}</small>
                  <small>{record.customer.phone || '-'}</small>
                </div>
                <div>
                  <span>Servicio</span>
                  <b>{record.booking.date || '-'} / {record.booking.pickupWindow || '-'}</b>
                  <small>{record.booking.hotel || '-'}</small>
                  <small>{record.booking.pickupZone || '-'}</small><small>Idioma: {record.booking.language || 'Por confirmar'}</small><small>Fotos: {record.booking.photos ? 'Si' : 'No'} / Recogida privada: {record.booking.privatePickup ? 'Si' : 'No'}</small>
                </div>
                <div>
                  <span>Operacion</span>
                  <b>{money(record.booking.total)}</b>
                  <small>{record.booking.passengers || '-'} pax / {record.booking.vehicles || '-'} buggy</small>
                  <small>{record.booking.paymentPreference || '-'}</small>
                </div>
              </div>

              <div className="admin-record-actions">
                {record.orderId && (record.status === 'capture_failed' || record.status === 'pending_payment') && <button type="button" disabled={!!savingId} onClick={() => reconcilePayment(record)}>{savingId === record.id ? 'Verificando...' : 'Verificar pago en PayPal'}</button>}
                <button type="button" disabled={!!savingId} onClick={() => { setDraft({ ...record, customer: { ...record.customer }, booking: { ...record.booking } }); setNote(''); setError(''); setNotice(''); }}>Editar reserva</button>
                <select
                  value={record.status}
                  disabled={!!savingId}
                  onChange={(event) => changeStatus(record.id, event.target.value as AdminRecordStatus)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
                {wa ? (
                  <a href={wa} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                ) : null}
                {record.customer.email ? <a href={`mailto:${record.customer.email}`}>Correo</a> : null}
              </div>

              {record.notes?.length ? (
                <details className="admin-notes">
                  <summary>Notas internas</summary>
                  {record.notes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </details>
              ) : null}
            </article>
          );
        })}
      </section>
      </> : <>
        <section className="admin-stat-grid admin-seo-stat-grid">
          <article><span>Páginas canónicas</span><strong>{seoSummary.pages.toLocaleString()}</strong></article>
          <article><span>Visitas (sesiones)</span><strong>{seoSummary.visits.toLocaleString()}</strong></article>
          <article><span>Vistas totales</span><strong>{seoSummary.views.toLocaleString()}</strong></article>
          <article><span>Vistas hoy</span><strong>{seoSummary.today.toLocaleString()}</strong></article>
          <article><span>Páginas visitadas</span><strong>{seoSummary.visitedPages.toLocaleString()}</strong></article>
        </section>

        <section className={`admin-storage-banner ${visits.persistent ? 'persistent' : 'temporary'}`}>
          <div><b>{visits.persistent ? 'Contador persistente activo' : 'Contador temporal'}</b><span>{visits.persistent ? 'Las métricas se conservan entre despliegues mediante Redis.' : 'Configura KV_REST_API_URL y KV_REST_API_TOKEN en Vercel para conservar las métricas entre despliegues.'}</span></div>
          <button type="button" onClick={refreshVisits} disabled={refreshingVisits}>{refreshingVisits ? 'Actualizando…' : 'Actualizar visitas'}</button>
        </section>

        <section className="admin-seo-toolbar">
          <input value={seoQuery} onChange={(event) => { setSeoQuery(event.target.value); setSeoLimit(100); }} placeholder="Buscar título o URL" />
          <select value={seoType} onChange={(event) => { setSeoType(event.target.value as typeof seoType); setSeoLimit(100); }}><option value="all">Todos los tipos</option>{Object.entries(seoTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          <select value={seoLocale} onChange={(event) => setSeoLocale(event.target.value as typeof seoLocale)}><option value="all">ES + EN</option><option value="es">Español</option><option value="en">Inglés</option></select>
          <select value={seoDestination} onChange={(event) => setSeoDestination(event.target.value as typeof seoDestination)}><option value="all">Todos los destinos</option><option value="punta-cana">Punta Cana</option><option value="bayahibe">Bayahibe</option><option value="general">General</option></select>
          <select value={seoSort} onChange={(event) => setSeoSort(event.target.value as typeof seoSort)}><option value="visits">Más visitas</option><option value="today">Más vistas hoy</option><option value="title">Título A–Z</option></select>
        </section>

        <section className="admin-seo-list-head"><span>Mostrando {Math.min(seoLimit, seoPages.length)} de {seoPages.length}</span><small>Actualizado: {formatDate(visits.updatedAt)}</small></section>
        <section className="admin-seo-grid">
          {seoPages.slice(0, seoLimit).map((page) => { const metric = visits.metrics[page.path] ?? { views: 0, visits: 0, today: 0 }; return <article className="admin-seo-card" key={page.path}>
            <div className="admin-seo-card-head"><span>{seoTypeLabels[page.type]} · {page.locale.toUpperCase()}</span><b>{page.destination === 'punta-cana' ? 'Punta Cana' : page.destination === 'bayahibe' ? 'Bayahibe' : 'General'}</b></div>
            <h2>{page.title}</h2>
            <div className="admin-seo-page-link">
              <code>{page.path}</code>
              <a href={page.url} target="_blank" rel="noreferrer">Ver landing ↗</a>
            </div>
            <div className="admin-seo-metrics"><span><small>Visitas</small><strong>{metric.visits.toLocaleString()}</strong></span><span><small>Vistas</small><strong>{metric.views.toLocaleString()}</strong></span><span><small>Hoy</small><strong>{metric.today.toLocaleString()}</strong></span></div>
            <div className="admin-seo-health"><span>Canonical ✓</span><span>Hreflang ✓</span>{page.schema.map((schema) => <span key={schema}>{schema}</span>)}</div>
            <small className="admin-seo-last">{metric.lastVisit ? `Última vista: ${formatDate(metric.lastVisit)}` : 'Todavía sin visitas registradas'}</small>
          </article>; })}
        </section>
        {seoLimit < seoPages.length ? <button className="admin-load-more" type="button" onClick={() => setSeoLimit((current) => current + 100)}>Mostrar 100 páginas más</button> : null}
      </>}
      {draft && <dialog ref={editorRef} className="admin-editor-backdrop" aria-label="Editar reserva" onCancel={e => { e.preventDefault(); if (!savingId) setDraft(null); }}><form className="admin-editor" onSubmit={saveDetails}>
        <h2>Editar reserva</h2><p>{draft.reference || draft.id} · {draft.productName}</p>
        <div className="admin-editor-fields">
          {([['name','Cliente'],['email','Correo'],['phone','Teléfono']] as const).map(([key,label],i) => <label key={key}>{label}<input autoFocus={i === 0} maxLength={300} type={key === 'email' ? 'email' : 'text'} value={draft.customer[key] || ''} onChange={e => setDraft({ ...draft, customer: { ...draft.customer, [key]: e.target.value } })} /></label>)}
          {([['date','Fecha'],['pickupWindow','Hora de recogida'],['hotel','Hotel o punto de encuentro'],['pickupZone','Zona'],['language','Idioma']] as const).map(([key,label]) => <label key={key}>{label}<input maxLength={300} type={key === 'date' ? 'date' : 'text'} value={draft.booking[key] || ''} onChange={e => setDraft({ ...draft, booking: { ...draft.booking, [key]: e.target.value } })} /></label>)}
        </div>
        <p>{draft.booking.passengers || '-'} pasajeros · {draft.booking.vehicles || '-'} vehículos · Total: {money(draft.booking.total)}</p>
        <label>Agregar nota interna<textarea maxLength={2000} rows={3} value={note} onChange={e => setNote(e.target.value)} /></label>
        {error && <p role="alert" className="admin-feedback error">{error}</p>}
        <div className="admin-record-actions"><button type="button" disabled={!!savingId} onClick={() => setDraft(null)}>Cancelar</button><button type="submit" disabled={!!savingId}>{savingId ? 'Guardando...' : 'Guardar cambios'}</button></div>
      </form></dialog>}
    </main>
  );
}
