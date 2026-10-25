import { deliverOnce } from './paymentDelivery';
import type { BuggyProduct } from './buggyProducts';
import { sendEmail } from './email';
import { renderBookingEmail } from './bookingEmailTemplate';

export type BookingEmailPayload = {
  productId: string; date: string; passengers: number; pickupZone: string;
  hotel: string; name: string; phone: string; email: string; language: string;
  locale?: string; fleet?: Record<string, number>; pickupWindow: string;
  paymentPreference: string; photos: boolean; privatePickup: boolean;
};
export type BookingPricing = {
  passengers: number; vehicles: number; fleetSummary?: string; baseTotal: number;
  zoneFee: number; photosFee: number; privatePickupFee: number; total: number;
};
export async function sendPaidBookingEmails(input: {
  booking: BookingEmailPayload; product: BuggyProduct; pricing: BookingPricing;
  orderId: string; reference: string;
}) {
  const adminTo = process.env.BOOKING_EMAIL_TO || 'info@proactivitis.com';
  const deliveries = await Promise.all([
    deliverOnce('caribbean-buggy', input.reference, 'admin_email', () => sendEmail({
      to: adminTo, replyTo: input.booking.email, ...renderBookingEmail(input, true),
    })),
    deliverOnce('caribbean-buggy', input.reference, 'customer_email', () => sendEmail({
      to: input.booking.email, replyTo: adminTo, ...renderBookingEmail(input, false),
    })),
  ]);
  return deliveries.every(Boolean);
}
