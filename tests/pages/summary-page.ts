import { Page, Locator } from "@playwright/test";

export class SummaryPage {
  readonly customerName: Locator;
  readonly customerPhone: Locator;
  readonly customerEmail: Locator;
  readonly eventAddress: (idx: number) => Locator;
  readonly eventDate: (idx: number) => Locator;
  readonly eventTime: (idx: number) => Locator;
  readonly totalChildren: Locator;
  readonly totalNannies: Locator;
  readonly totalHours: Locator;
  readonly subtotal: Locator;

  constructor(page: Page) {
    this.customerName = page.locator('[data-testid="customer-name"]');
    this.customerPhone = page.locator('[data-testid="customer-phone"]');
    this.customerEmail = page.locator('[data-testid="customer-email"]');
    this.eventAddress = (idx: number) =>
      page.locator(`[data-testid="event-${idx}-address"]`);
    this.eventDate = (idx: number) =>
      page.locator(`[data-testid="event-${idx}-date"]`);
    this.eventTime = (idx: number) =>
      page.locator(`[data-testid="event-${idx}-time"]`);
    this.totalChildren = page.locator('[data-testid="total-children"]');
    this.totalNannies = page.locator('[data-testid="total-nannies"]');
    this.totalHours = page.locator('[data-testid="total-hours"]');
    this.subtotal = page.locator('[data-testid="subtotal"]');
  }
}
