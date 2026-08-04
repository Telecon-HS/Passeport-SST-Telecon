import type { EmployeeTrainingRecord } from "@/types";
import { employees } from "./employees";
import { requiredModulesFor } from "@/lib/matrix-engine";

// Deterministic pseudo-random generator so the dataset is stable across renders.
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const trainingRecords: EmployeeTrainingRecord[] = [];

employees.forEach((emp, idx) => {
  const rand = seededRandom(1000 + idx * 37);
  const relevant = requiredModulesFor(emp);
  relevant.forEach((mod) => {
    const roll = rand();
    const threshold = emp.compliance / 100;
    let state: EmployeeTrainingRecord["state"];
    if (roll < threshold - 0.15) {
      state = "Complété";
    } else if (roll < threshold + 0.05) {
      state = "En cours";
    } else if (roll < threshold + 0.12 && emp.compliance > 60) {
      state = "Expire bientôt";
    } else {
      state = "À faire";
    }
    const rec: EmployeeTrainingRecord = {
      employeeId: emp.id,
      moduleId: mod.id,
      state,
    };
    if (state === "Complété" || state === "Expire bientôt") {
      rec.completedDate = "2026-0" + (1 + Math.floor(rand() * 7)) + "-1" + Math.floor(rand() * 9);
      rec.quizScore = mod.requiresQuiz ? Math.round(72 + rand() * 28) : undefined;
      rec.expiryDate = state === "Expire bientôt" ? "2026-09-1" + Math.floor(rand() * 9) : "2027-06-01";
    }
    trainingRecords.push(rec);
  });
});

export const recordsForEmployee = (employeeId: string) =>
  trainingRecords.filter((r) => r.employeeId === employeeId);
