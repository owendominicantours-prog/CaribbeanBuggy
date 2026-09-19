type PaypalOrder = {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    reference_id?: string;
    custom_id?: string;
    payments?: { captures?: Array<{ id?: string; status?: string; amount?: { value?: string; currency_code?: string } }> };
  }>;
};

export function verifyCompletedPayment(order: PaypalOrder, expected: { orderId?: string; reference?: string; total?: number }) {
  if (!expected.orderId || !expected.reference || !Number.isFinite(expected.total) || !expected.total || expected.total < 0) return false;
  if (order.id !== expected.orderId || order.status !== 'COMPLETED' || order.purchase_units?.length !== 1) return false;
  const unit = order.purchase_units[0];
  if (unit.reference_id !== expected.reference && unit.custom_id !== expected.reference) return false;
  const captures = unit.payments?.captures || [];
  if (!captures.length || captures.some(c => !c.id || c.status !== 'COMPLETED' || c.amount?.currency_code !== 'USD' || !Number.isFinite(Number(c.amount.value)) || Number(c.amount.value) <= 0)) return false;
  return captures.reduce((sum,c) => sum + Math.round(Number(c.amount!.value) * 100), 0) === Math.round(expected.total * 100);
}
