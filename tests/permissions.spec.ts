// tests/permissions.spec.ts

import { canReceiveMoney, canConfirmIncome, canHandToTreasurer, canRunPOS } from "../src/models/church-finance-model";
import { RoleAssignment, Role, EntityScope } from "../src/models/church-finance-model";

describe("permission helpers", () => {
  const churchScope: EntityScope = { type: "church", id: "main" };
  const orgScope: EntityScope = { type: "organization", id: "org-1" };

  const assignments: RoleAssignment[] = [
    { userId: "u1", role: Role.FinanceCommittee, scope: churchScope },
    { userId: "u2", role: Role.ChiefRecordingSecretary, scope: churchScope },
    { userId: "u3", role: Role.Treasurer, scope: orgScope },
    { userId: "u4", role: Role.FinanceCommittee, scope: orgScope },
  ];

  test("finance committee can receive money in church scope", () => {
    expect(canReceiveMoney(assignments.filter(a => a.userId === "u1"), churchScope)).toBe(true);
  });

  test("chief recording secretary can confirm", () => {
    expect(canConfirmIncome(assignments.filter(a => a.userId === "u2"), churchScope)).toBe(true);
  });

  test("treasurer can be handed to in org scope", () => {
    expect(canHandToTreasurer(assignments.filter(a => a.userId === "u3"), orgScope)).toBe(true);
  });

  test("finance committee in org can run POS", () => {
    expect(canRunPOS(assignments.filter(a => a.userId === "u4"), orgScope)).toBe(true);
  });
});
