'use client';

import { useMemo, useState } from 'react';
import type { AdminRecord, AdminRecordStatus } from '../../lib/adminStore';

type AdminPanelClientProps = {
  initialRecords: AdminRecord[];
};

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

export default function AdminPanelClient({ initialRecords }: AdminPanelClientProps) {
  const [records, setRecords] = useState(initialRecords);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminRecordStatus>('all');
  const [savingId, setSavingId] = useState('');

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

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <span>Caribbean Buggy</span>
          <h1>Reservas y consultas</h1>
          <p>Control operativo para pagos PayPal, consultas por WhatsApp y solicitudes pendientes.</p>
        </div>
        <button type="button" onClick={logout}>
          Cerrar sesion
        </button>
      </header>

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
    </main>
  );
}
