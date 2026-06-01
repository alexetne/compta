"use server";

import { revalidatePath } from "next/cache";
import { requirePluginEnabled } from "@/plugins/guards";
import { setPluginEnabled } from "@/plugins/installations";
import { getOrCreateDevSession } from "@/server/auth";
import { createExpense } from "@/server/services/finance";
import { createPatient } from "@/server/services/patients";
import { createServiceItem } from "@/server/services/service-items";

function optionalString(value: FormDataEntryValue | null) {
  const text = value?.toString().trim();
  return text ? text : undefined;
}

function eurosToCents(value: FormDataEntryValue | null) {
  const raw = value?.toString().replace(",", ".") ?? "0";
  return Math.round(Number(raw) * 100);
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

export async function setPluginEnabledAction(formData: FormData) {
  const session = await getOrCreateDevSession();
  const pluginId = formData.get("pluginId")?.toString() ?? "";
  const enabled = formData.get("enabled")?.toString() === "true";

  await setPluginEnabled(session.cabinetId, pluginId, enabled);

  revalidatePath("/plugins");
  revalidatePath("/");
}
