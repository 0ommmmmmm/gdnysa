/**
 * Client-side PDF export via the browser print dialog.
 * Pure frontend — no backend involved.
 */
import type { MentorshipApplication } from "@/types/admin";

export function downloadApplicationPdf(application: MentorshipApplication) {
  const rows: Array<[string, string]> = [
    ["Full Name", application.full_name],
    ["Email", application.email],
    ["Phone", application.phone],
    ["Target Exam", application.target_exam],
    ["Preferred Program", application.preferred_program],
    ["Status", application.status],
    ["Submitted", new Date(application.created_at).toLocaleString()],
    ["Message", application.message || "—"],
    ["Internal Notes", application.internal_notes || "—"],
  ];

  const win = window.open("", "_blank", "width=800,height=900");
  if (!win) return;

  win.document.write(`<!doctype html><html><head><meta charset="utf-8" />
    <title>G-Dnyasa Application — ${application.full_name}</title>
    <style>
      body { font-family: Georgia, serif; padding: 40px; color: #2f2f2b; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      p.sub { color: #6b6b60; margin-top: 0; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      td { border-bottom: 1px solid #e2e0d5; padding: 10px 6px; vertical-align: top; font-size: 14px; }
      td.k { width: 200px; color: #6b6b60; font-weight: bold; }
    </style></head><body>
    <h1>G-Dnyasa — Mentorship Application</h1>
    <p class="sub">Generated ${new Date().toLocaleString()}</p>
    <table>${rows
      .map(([k, v]) => `<tr><td class="k">${k}</td><td>${escapeHtml(v)}</td></tr>`)
      .join("")}</table>
    </body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
