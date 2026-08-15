# Finance Model — UMC Organizational Framework

This document describes the minimal domain model, permissions, and audit flow for the United Methodist Church (UMC) organizational finance rules implemented in TypeScript.

## Summary of rules
- Each organization/section and the main church are audited separately.
- Main church:
  - Finance committee members and the Church Administrator can receive monies.
  - The Chief Recording Secretary oversees and confirms all income.
  - After confirmation, the Treasurer processes the funds.
- Organizations/Sections:
  - The Treasurer is the primary role responsible for funds.
  - Finance committee members in organizations may also operate POS devices.

## Files added
- src/models/church-finance-model.ts — TypeScript interfaces and permission helper functions.
- docs/finance-model/README.md — This design document.
- tests/permissions.spec.ts — Basic Jest tests for the permission helpers.

## Data model (conceptual DB tables)
- users: id, name, email
- role_assignments: user_id, role, scope_type, scope_id
- transactions: id, scope_type, scope_id, amount_cents, currency, type, status, received_by, timestamps JSON, metadata JSON
- audit_records: id, scope_type, scope_id, transaction_id, performed_by, action, note, created_at

Index frequently by (scope_type, scope_id) for fast per-scope queries.

## Workflow
1. A permitted receiver (FinanceCommittee member or ChurchAdmin for main church; Treasurer or FinanceCommittee/POSOperator for organizations as allowed) records a Transaction with status `Received` and attaches metadata (receipt/photo).
2. The Chief Recording Secretary for that scope reviews and marks `Confirmed` (or `Rejected`).
3. The Treasurer for that scope is notified and marks `WithTreasurer` when they take custody/prepare deposits.
4. Auditors review transactions and create `AuditRecord` entries; when complete, the transaction becomes `Reconciled`.

## Next steps
- Integrate these types into your backend (Express/Nest) and create RBAC middleware.
- Provide API endpoint stubs and SQL migrations (I can add these next if you prefer).
- Add UI forms for POS and confirmation flows.

