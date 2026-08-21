'use client';

import { useMemo, useState } from 'react';
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
  if (!value) return '-';
  const options: Intl.DateTimeFormatOptions = value.includes('T')
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' };

  return new Intl.DateTimeFormat('es-DO', options).format(new Date(value));
}

function whatsappLink(phone?: string) {
  const digits = (phone || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

export default function AdminPanelClient({ initialRecords, initialSeoPages, initialVisits, recordsPersistent }: AdminPanelClientProps) {
  const [records, setRecords] = useState(initialRecords);
  const [activePanel, setActivePanel] = useState<'operations' | 'seo'>('operations');
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

      return matchesStatus && (!needle || haystack.includes(needle));
    });
  }, [query, records, statusFilter]);

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
    } finally {
      setSavingId('');
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
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

      <section className="admin-toolbar">
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
                  <small>{record.booking.pickupZone || '-'}</small>
                </div>
                <div>
                  <span>Operacion</span>
                  <b>{money(record.booking.total)}</b>
                  <small>{record.booking.passengers || '-'} pax / {record.booking.vehicles || '-'} buggy</small>
                  <small>{record.booking.paymentPreference || '-'}</small>
                </div>
              </div>

              <div className="admin-record-actions">
                <select
                  value={record.status}
                  disabled={savingId === record.id}
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
    </main>
  );
}
