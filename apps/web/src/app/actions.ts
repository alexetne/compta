"use server";

import { revalidatePath } from "next/cache";
import { requirePluginEnabled } from "@/plugins/guards";
import { setPluginEnabled } from "@/plugins/installations";
import { getOrCreateDevSession } from "@/server/auth";
import { createAppointment, updateAppointmentStatus } from "@/server/services/appointments";
import { createExpense } from "@/server/services/finance";
import { createPayment } from "@/server/services/finance";
import { cancelInvoice, createInvoice, issueInvoice } from "@/server/services/invoices";
import { createPatient } from "@/server/services/patients";
import { createRetrocession } from "@/server/services/retrocessions";
import { createServiceItem } from "@/server/services/service-items";

function optionalString(value: FormDataEntryValue | null) {
  const text = value?.toString().trim();
  return text ? text : undefined;
}

function eurosToCents(value: FormDataEntryValue | null) {
  const raw = value?.toString().replace(",", ".") ?? "0";
  return Math.round(Number(raw) * 100);
}

function dateTimeFromForm(dateValue: FormDataEntryValue | null, timeValue: FormDataEntryValue | null) {
  const date = dateValue?.toString();
  const time = timeValue?.toString();

  if (!date || !time) {
    return new Date().toISOString();
  }

  return new Date(`${date}T${time}`).toISOString();
}

export async function createPatientAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  await requirePluginEnabled(session.cabinetId, "care.patients");

  await createPatient(session.cabinetId, {
    firstName: formData.get("firstName")?.toString() ?? "",
    lastName: formData.get("lastName")?.toString() ?? "",
    email: optionalString(formData.get("email")),
    phone: optionalString(formData.get("phone")),
    administrativeNotes: optionalString(formData.get("administrativeNotes")),
  });

  revalidatePath("/patients");
  revalidatePath("/");
}

export async function createAppointmentAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  await requirePluginEnabled(session.cabinetId, "care.appointments");
  const startsAt = dateTimeFromForm(formData.get("date"), formData.get("startsAt"));
  const endsAt = dateTimeFromForm(formData.get("date"), formData.get("endsAt"));

  await createAppointment(session.cabinetId, {
    patientId: optionalString(formData.get("patientId")),
    serviceItemId: optionalString(formData.get("serviceItemId")),
    practitionerId: session.user.id,
    startsAt,
    endsAt,
    status: "SCHEDULED",
    notes: optionalString(formData.get("notes")),
  });

  revalidatePath("/agenda");
  revalidatePath("/");
}

export async function updateAppointmentStatusAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  await requirePluginEnabled(session.cabinetId, "care.appointments");
  const appointmentId = formData.get("appointmentId")?.toString() ?? "";
  const status = formData.get("status")?.toString();

  await updateAppointmentStatus(session.cabinetId, appointmentId, {
    status:
      status === "CONFIRMED" ||
      status === "CANCELLED" ||
      status === "NO_SHOW" ||
      status === "COMPLETED"
        ? status
        : "SCHEDULED",
  });

  revalidatePath("/agenda");
  revalidatePath("/");
}

export async function createServiceItemAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  await requirePluginEnabled(session.cabinetId, "cabinet.service-items");

  await createServiceItem(session.cabinetId, {
    name: formData.get("name")?.toString() ?? "",
    description: optionalString(formData.get("description")),
    defaultDurationMin: Number(formData.get("defaultDurationMin") ?? 45),
    defaultAmountCents: eurosToCents(formData.get("defaultAmount")),
    currency: "EUR",
  });

  revalidatePath("/prestations");
  revalidatePath("/");
}

export async function createExpenseAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  await requirePluginEnabled(session.cabinetId, "finance.accounting");
  const today = new Date().toISOString();

  await createExpense(session.cabinetId, {
    label: formData.get("label")?.toString() ?? "",
    amountCents: eurosToCents(formData.get("amount")),
    currency: "EUR",
    expenseDate: optionalString(formData.get("expenseDate"))
      ? new Date(formData.get("expenseDate")?.toString() ?? today).toISOString()
      : today,
    supplier: optionalString(formData.get("supplier")),
    notes: optionalString(formData.get("notes")),
  });

  revalidatePath("/charges");
  revalidatePath("/");
}

export async function createInvoiceAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  await requirePluginEnabled(session.cabinetId, "billing.invoices");
  const today = new Date().toISOString();
  const serviceItemId = optionalString(formData.get("serviceItemId"));
  const serviceLabel = optionalString(formData.get("serviceLabel"));

  await createInvoice(session.cabinetId, {
    patientId: optionalString(formData.get("patientId")),
    issuedAt: optionalString(formData.get("issuedAt"))
      ? new Date(formData.get("issuedAt")?.toString() ?? today).toISOString()
      : undefined,
    dueAt: optionalString(formData.get("dueAt"))
      ? new Date(formData.get("dueAt")?.toString() ?? today).toISOString()
      : undefined,
    notes: optionalString(formData.get("notes")),
    lines: [
      {
        serviceItemId,
        label: serviceLabel ?? formData.get("label")?.toString() ?? "Prestation",
        quantity: Number(formData.get("quantity") ?? 1),
        unitCents: eurosToCents(formData.get("unitAmount")),
      },
    ],
  });

  revalidatePath("/factures");
  revalidatePath("/");
}

export async function issueInvoiceAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  await requirePluginEnabled(session.cabinetId, "billing.invoices");
  const invoiceId = formData.get("invoiceId")?.toString() ?? "";

  await issueInvoice(session.cabinetId, invoiceId);

  revalidatePath("/factures");
  revalidatePath("/");
}

export async function cancelInvoiceAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  await requirePluginEnabled(session.cabinetId, "billing.invoices");
  const invoiceId = formData.get("invoiceId")?.toString() ?? "";

  await cancelInvoice(session.cabinetId, invoiceId);

  revalidatePath("/factures");
  revalidatePath("/");
}

export async function createPaymentAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  await requirePluginEnabled(session.cabinetId, "finance.payments");
  const today = new Date().toISOString();

  await createPayment(session.cabinetId, {
    invoiceId: optionalString(formData.get("invoiceId")),
    amountCents: eurosToCents(formData.get("amount")),
    currency: "EUR",
    paidAt: optionalString(formData.get("paidAt"))
      ? new Date(formData.get("paidAt")?.toString() ?? today).toISOString()
      : today,
    method:
      formData.get("method")?.toString() === "CASH" ||
      formData.get("method")?.toString() === "CHECK" ||
      formData.get("method")?.toString() === "BANK_TRANSFER" ||
      formData.get("method")?.toString() === "THIRD_PARTY" ||
      formData.get("method")?.toString() === "OTHER"
        ? (formData.get("method")?.toString() as "CASH" | "CHECK" | "BANK_TRANSFER" | "THIRD_PARTY" | "OTHER")
        : "CARD",
    reference: optionalString(formData.get("reference")),
    notes: optionalString(formData.get("notes")),
  });

  revalidatePath("/paiements");
  revalidatePath("/factures");
  revalidatePath("/");
}

export async function setPluginEnabledAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  const pluginId = formData.get("pluginId")?.toString() ?? "";
  const enabled = formData.get("enabled")?.toString() === "true";

  await setPluginEnabled(session.cabinetId, pluginId, enabled);

  revalidatePath("/plugins");
  revalidatePath("/");
}

export async function createRetrocessionAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  await requirePluginEnabled(session.cabinetId, "finance.retrocessions");
  const today = new Date().toISOString();

  await createRetrocession(session.cabinetId, {
    direction: formData.get("direction")?.toString() === "RECEIVED" ? "RECEIVED" : "PAID",
    status: formData.get("status")?.toString() === "SETTLED" ? "SETTLED" : "DUE",
    label: formData.get("label")?.toString() ?? "",
    counterparty: formData.get("counterparty")?.toString() ?? "",
    amountCents: eurosToCents(formData.get("amount")),
    currency: "EUR",
    periodStart: optionalString(formData.get("periodStart"))
      ? new Date(formData.get("periodStart")?.toString() ?? today).toISOString()
      : today,
    periodEnd: optionalString(formData.get("periodEnd"))
      ? new Date(formData.get("periodEnd")?.toString() ?? today).toISOString()
      : today,
    settledAt:
      formData.get("status")?.toString() === "SETTLED"
        ? new Date(optionalString(formData.get("settledAt")) ?? today).toISOString()
        : undefined,
    notes: optionalString(formData.get("notes")),
  });

  revalidatePath("/retrocessions");
  revalidatePath("/");
}
