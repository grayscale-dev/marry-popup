import { test, expect } from "@playwright/test";
import { FormPage } from "./pages/form-page";
import { SummaryPage } from "./pages/summary-page";

test.describe("Summary and Pricing Calculation", () => {
  test("Displays correct info after form submit", async ({ page }) => {
    await page.goto("");
    const formPage = new FormPage(page);
    const summaryPage = new SummaryPage(page);
    await formPage.firstNameInput.fill("Test");
    await formPage.lastNameInput.fill("User");
    await formPage.phoneInput.fill("8005551234");
    await formPage.emailInput.fill("test@test.com");
    await formPage.childrenSelector(2).click();
    await formPage.infantSelector(1).click();
    await formPage.addressInput(0).fill("50 N W Temple St");
    await formPage.addressItem(0).click();
    await formPage.setDateTo7DaysFromNow(0);
    await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
    await formPage.selectTime(formPage.endTimePicker(0), "12:00 pm");

    await formPage.yesRadio.click();
    await formPage.addressInput(1).fill("742 N 900 E St");
    await formPage.addressItem(0).click();

    await formPage.selectTime(formPage.startTimePicker(1), "12:00 pm");
    await formPage.selectTime(formPage.endTimePicker(1), "3:00 pm");

    await formPage.submit();

    await expect(summaryPage.customerName).toHaveText("Test User");
    await expect(summaryPage.customerPhone).toHaveText("800-555-1234");
    await expect(summaryPage.customerEmail).toHaveText("test@test.com");
    await expect(summaryPage.eventAddress(0)).toHaveText(
      "50 N W Temple St, Salt Lake City, UT 84150, USA"
    );
    await expect(summaryPage.eventDate(0)).not.toHaveText(""); // Should show a date
    await expect(summaryPage.eventTime(0)).toHaveText("7:00 am - 12:00 pm");
    await expect(summaryPage.eventAddress(1)).toHaveText(
      "742 N 900 E St, American Fork, UT 84003, USA"
    );
    await expect(summaryPage.eventDate(1)).not.toHaveText(""); // Should show a date
    await expect(summaryPage.eventTime(1)).toHaveText("12:00 pm - 3:00 pm");
    await expect(summaryPage.totalChildren).toHaveText("3 (1 under 18 months)");
    await expect(summaryPage.totalNannies).not.toHaveText(""); // Should show a number
    await expect(summaryPage.totalHours).toHaveText("8");
    await expect(summaryPage.subtotal).toHaveText("$629");
  });

  test("Pricing calculation: 2 Children, 1 infant, 6 hours = $489", async ({
    page,
  }) => {
    await page.goto("");
    const formPage = new FormPage(page);
    await formPage.childrenSelector(2).click();
    await formPage.infantSelector(1).click();
    await formPage.setDateTo7DaysFromNow(0);
    await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
    await formPage.selectTime(formPage.endTimePicker(0), "1:00 pm");
    await expect(page.locator(".summary-price")).toContainText("$489");
  });

  test("Pricing calculation: 7 Children, 4 infant, 9 hours = $1,911", async ({
    page,
  }) => {
    await page.goto("");
    const formPage = new FormPage(page);
    await formPage.childrenSelector(7).click();
    await formPage.infantSelector(4).click();
    await formPage.setDateTo7DaysFromNow(0);
    await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
    await formPage.selectTime(formPage.endTimePicker(0), "4:00 pm");
    await expect(page.locator(".summary-price")).toContainText("$1864");
  });

  test("Pricing calculation: 13 Children, 10 infant, 10 hours = $4,795", async ({
    page,
  }) => {
    await page.goto("");
    const formPage = new FormPage(page);
    await formPage.childrenSelector(13).click();
    await formPage.infantSelector(10).click();
    await formPage.setDateTo7DaysFromNow(0);
    await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
    await formPage.selectTime(formPage.endTimePicker(0), "5:00 pm");
    await expect(page.locator(".summary-price")).toContainText("$4633");
  });
});
