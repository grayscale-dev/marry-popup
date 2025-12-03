import { CostCalculator } from "@/app/utils/costCalculator";
import { test, expect } from "@playwright/test";

interface CostTestCase {
  totalKids: number;
  totalInfants: number;
  expectedClientSubtotal: number;
}

const costTestCases: (CostTestCase & { hours: number })[] = [
  {
    totalKids: 2,
    totalInfants: 0,
    expectedClientSubtotal: 489.0,
    hours: 6,
  },
  {
    totalKids: 6,
    totalInfants: 1,
    expectedClientSubtotal: 1038.0,
    hours: 8,
  },
  {
    totalKids: 12,
    totalInfants: 2,
    expectedClientSubtotal: 2180.0,
    hours: 10,
  },
  {
    totalKids: 1,
    totalInfants: 0,
    expectedClientSubtotal: 336.96,
    hours: 4,
  },
  {
    totalKids: 3,
    totalInfants: 3,
    expectedClientSubtotal: 1042.0,
    hours: 9,
  },
];

test.describe("Cost Calculator", () => {
  costTestCases.forEach(
    ({ totalKids, totalInfants, expectedClientSubtotal, hours }, idx) => {
      test(`should calculate correct subtotal for test case #${
        idx + 1
      }`, () => {
        const calc = new CostCalculator(totalKids, totalInfants, hours);
        expect(calc.clientSubtotal).toBeCloseTo(expectedClientSubtotal, 2);
      });
    }
  );
});
