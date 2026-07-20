// state.js — the single source of truth for the app's in-memory data, plus the
// constants/defaults that shape it. No rendering or DOM-writing logic lives
// here on purpose: everything else imports `state` and reads/writes it.

import { $, uid } from "./dom.js";

export const KEY = "invoiceStudioPro.v2";

export const defaultColumns = () => [
  { id: uid(), key: "sku", label: "SKU", type: "text", width: 14, align: "left", visible: true, role: "none" },
  { id: uid(), key: "description", label: "Description", type: "text", width: 44, align: "left", visible: true, role: "none" },
  { id: uid(), key: "quantity", label: "Qty", type: "number", width: 11, align: "right", visible: true, role: "quantity" },
  { id: uid(), key: "rate", label: "Rate", type: "currency", width: 14, align: "right", visible: true, role: "rate" },
  { id: uid(), key: "amount", label: "Amount", type: "currency", width: 17, align: "right", visible: true, role: "amount" }
];

export const sectionDefs = [
  ["logo", "Logo"], ["company", "Company details"], ["client", "Client details"], ["status", "Invoice status"],
  ["invoiceDate", "Invoice date"], ["dueDate", "Due date"], ["reference", "Reference / PO"], ["balance", "Balance due"],
  ["notes", "Notes"], ["discount", "Discount"], ["tax", "Tax"], ["shipping", "Shipping"], ["payment", "Payment details"],
  ["terms", "Terms"], ["footer", "Footer"]
];

export const state = {
  logo: "",
  logoNatural: null,
  zoom: 1,
  columns: defaultColumns(),
  items: [],
  sections: Object.fromEntries(sectionDefs.map(x => [x[0], true]))
};

export const fields = ["logoHeight", "invoiceNumber", "status", "invoiceDate", "dueDate", "currency", "reference", "companyName", "companyReg", "companyVat", "companyAddress", "companyPhone", "companyEmail", "companyWebsite", "clientName", "clientContact", "clientTax", "clientAddress", "clientEmail", "discount", "tax", "shipping", "notes", "paymentDetails", "terms", "template", "accent", "accentHex", "paperSize"];

export const DEFAULT_ACCENT = "#18181b";

export const PAPER_SIZES = {
  a4: { w: 210, h: 297, page: "A4", pdfName: "A4", ptW: 595.28, ptH: 841.89 },
  letter: { w: 215.9, h: 279.4, page: "215.9mm 279.4mm", pdfName: "LETTER", ptW: 612, ptH: 792 }
};

export function currentPaper() {
  const sel = $("paperSize");
  return PAPER_SIZES[sel ? sel.value : "a4"] || PAPER_SIZES.a4;
}

export function applyPaperSize() {
  const p = currentPaper();
  document.documentElement.style.setProperty("--page-w", p.w + "mm");
  document.documentElement.style.setProperty("--page-h", p.h + "mm");
  $("pageSizeCSS").textContent = p.page === "A4" ? "" : `@page{size:${p.page};margin:0}`;
}

// Snapshot everything needed to fully reconstruct the current invoice
// (used for localStorage autosave, History entries, export, and undo/redo).
export function serialize() {
  let f = {};
  fields.forEach(id => f[id] = $(id).value);
  return { version: 2, logo: state.logo, logoNatural: state.logoNatural, zoom: state.zoom, columns: state.columns, items: state.items, sections: state.sections, fields: f };
}
