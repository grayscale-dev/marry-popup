import { Page, Locator } from "@playwright/test";

export class FormPage {
  readonly page: Page;
  readonly submitButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly childrenSelector: (index: number) => Locator;
  readonly infantSelector: (index: number) => Locator;
  readonly datePicker: (index: number) => Locator;
  readonly startTimePicker: (index: number) => Locator;
  readonly endTimePicker: (index: number) => Locator;
  readonly timeOption: (time: string) => Locator;
  readonly yesRadio: Locator;
  readonly errorMessage: Locator;
  readonly addressInput: (index: number) => Locator;
  readonly addressItem: (index: number) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.locator('button[type="submit"]');
    this.firstNameInput = page.locator("#input-first-name");
    this.lastNameInput = page.locator("#input-last-name");
    this.phoneInput = page.locator("#input-phone");
    this.emailInput = page.locator("#input-email");
    this.yesRadio = page.locator("#yes");
    this.childrenSelector = (index: number) =>
      page.locator(`#children-selector-${index}`);
    this.infantSelector = (index: number) =>
      page.locator(`#infant-selector-${index}`);
    this.datePicker = (index: number) => page.locator(`#date-picker-${index}`);
    this.startTimePicker = (index: number) =>
      page.locator(`#start-time-picker-${index}`);
    this.endTimePicker = (index: number) =>
      page.locator(`#end-time-picker-${index}`);
    this.timeOption = (time: string) => page.locator(`[aria-label="${time}"]`);
    this.errorMessage = page.locator("#error-message");
    this.addressInput = (index: number) =>
      page.locator(`.address-input-${index}`);
    this.addressItem = (index: number) =>
      page.locator(`.p-autocomplete-item[role="option"][index="${index}"]`);
  }

  async submit() {
    await this.submitButton.click();
  }

  async getHighestInfantCount() {
    const infantOptionsDiv = this.page.locator(".infant-options");
    const lastButton = infantOptionsDiv.locator("button").last();
    const id = await lastButton.getAttribute("id");
    return id;
  }

  async writeDate(date: Date, inputIndex: number) {
    let datePickerInput = this.datePicker(inputIndex);
    datePickerInput = datePickerInput.locator("input");
    // await datePickerInput.click();
    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    await datePickerInput.fill(formattedDate);
    await datePickerInput.press("Escape");
  }

  async setDateTo7DaysFromNow(inputIndex: number) {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 8);
    await this.writeDate(sevenDaysFromNow, inputIndex);
  }

  async selectTime(input: Locator, time: string) {
    await input.click();
    await this.timeOption(time).click();
    await input.press("Escape");
    await this.page.waitForTimeout(200);
  }

  async getLastItemInTimeDropdown(timeInput: Locator) {
    await timeInput.click();
    const firstItem = this.page
      .locator(".p-dropdown-items .p-dropdown-item")
      .last();
    const ariaLabel = await firstItem.getAttribute("aria-label");
    await timeInput.press("Escape");
    return ariaLabel;
  }

  async getFirstItemInTimeDropdown(timeInput: Locator) {
    await timeInput.click();
    const firstItem = this.page
      .locator(".p-dropdown-items .p-dropdown-item")
      .first();
    const ariaLabel = await firstItem.getAttribute("aria-label");
    await timeInput.press("Escape");
    return ariaLabel;
  }
}
