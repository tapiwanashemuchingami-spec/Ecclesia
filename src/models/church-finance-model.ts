// src/models/church-finance-model.ts

export type EntityScope = { type: "church" | "organization" | "section"; id: string };

export enum Role {
  ChurchAdmin = "ChurchAdmin",
  FinanceCommittee = "FinanceCommittee",
  ChiefRecordingSecretary = "ChiefRecordingSecretary",
  Treasurer = "Treasurer",
  POSOperator = "POSOperator",
  Auditor = "Auditor",
}

export interface User {
  id: string;
  name: string;
}

export interface RoleAssignment {
  userId: string;
  role: Role;
  scope: EntityScope; // where the role applies
}

export enum TransactionType {
  Cash = "Cash",
  BankTransfer = "BankTransfer",
  POS = "POS",
  Donation = "Donation",
  Other = "Other",
}

export enum TransactionStatus {
  Received = "Received",
  Confirmed = "Confirmed",
  WithTreasurer = "WithTreasurer",
  Reconciled = "Reconciled",
  Rejected = "Rejected",
}

export interface Transaction {
  id: string;
  scope: EntityScope;
  amountCents: number;
  currency: string;
  type: TransactionType;
  receivedByUserId: string;
  status: TransactionStatus;
  timestamps: {
    receivedAt: string;
    confirmedAt?: string;
    withTreasurerAt?: string;
    reconciledAt?: string;
  };
  metadata?: Record<string, any>;
}

export interface AuditRecord {
  id: string;
  scope: EntityScope;
  transactionId: string;
  performedByUserId: string;
  action: string; // e.g., "inspect", "flag", "approve"
  note?: string;
  createdAt: string;
}

// Permission helpers
export function canReceiveMoney(assignments: RoleAssignment[], scope: EntityScope): boolean {
  // Main church: FinanceCommittee and ChurchAdmin can receive money
  return assignments.some(a =>
    a.scope.type === scope.type && a.scope.id === scope.id && (
      a.role === Role.FinanceCommittee ||
      a.role === Role.ChurchAdmin
    )
  );
}

export function canConfirmIncome(assignments: RoleAssignment[], scope: EntityScope): boolean {
  // ChiefRecordingSecretary in that scope can confirm
  return assignments.some(a =>
    a.scope.type === scope.type && a.scope.id === scope.id && a.role === Role.ChiefRecordingSecretary
  );
}

export function canHandToTreasurer(assignments: RoleAssignment[], scope: EntityScope): boolean {
  // Treasurer in that scope handles after confirmation
  return assignments.some(a =>
    a.scope.type === scope.type && a.scope.id === scope.id && a.role === Role.Treasurer
  );
}

export function canRunPOS(assignments: RoleAssignment[], scope: EntityScope): boolean {
  // In organizations and sections, FinanceCommittee members can run POS; POSOperator role always allowed
  return assignments.some(a =>
    a.scope.type === scope.type && a.scope.id === scope.id && (
      a.role === Role.POSOperator ||
      (scope.type !== "church" && a.role === Role.FinanceCommittee)
    )
  );
}

export function canAudit(assignments: RoleAssignment[], scope: EntityScope): boolean {
  return assignments.some(a =>
    a.scope.type === scope.type && a.scope.id === scope.id && a.role === Role.Auditor
  );
}
