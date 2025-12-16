import DateTimePicker from "@/app/components/datetime-picker";
import { BookingClass } from "@/app/models/Booking";
import { useDeepState } from "@/app/utils/useDeepState";
import { test, expect } from "@playwright/test";
import { FormPage } from "./pages/form-page";

test("Start/End time fields disabled on load", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await expect(formPage.startTimePicker(0)).toHaveAttribute(
    "data-p-disabled",
    "true"
  );
});

test("Minimum date = Today + 7 days", async ({ page }) => {
  await page.goto("");
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 6);
  const formPage = new FormPage(page);
  await formPage.datePicker(0).click();
  const dayElements = await page.$$("[data-pc-section='day']");
  for (const day of dayElements) {
    const ariaLabel = await day.getAttribute("aria-label");
    const dayDate = new Date(ariaLabel as string);
    const isOtherMonth = await day.getAttribute("data-p-other-month");
    const span = await day.$("span");
    if (dayDate < sevenDaysFromNow || isOtherMonth) {
      await expect(await span?.getAttribute("data-p-disabled")).toBe("true");
    } else {
      await expect(await span?.getAttribute("data-p-disabled")).toBe("false");
    }
  }
});

test("Selecting a start time enables end time", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await expect(formPage.startTimePicker(0)).toHaveAttribute(
    "data-p-disabled",
    "true"
  );
  await expect(formPage.endTimePicker(0)).toHaveAttribute(
    "data-p-disabled",
    "true"
  );
  await formPage.setDateTo7DaysFromNow(0);
  await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
  await expect(formPage.endTimePicker(0)).toHaveAttribute(
    "data-p-disabled",
    "false"
  );
});

test("Start time allowed: 7:00 AM – 11:00 PM", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.setDateTo7DaysFromNow(0);

  const firstTime = await formPage.getFirstItemInTimeDropdown(
    formPage.startTimePicker(0)
  );
  expect(firstTime).toBe("7:00 am");

  const lastTime = await formPage.getLastItemInTimeDropdown(
    formPage.startTimePicker(0)
  );
  expect(lastTime).toBe("11:00 pm");
});

test("End time auto-adjusts to start time", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.setDateTo7DaysFromNow(0);
  await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
  let endTimePickerInput = formPage.endTimePicker(0);
  expect(await formPage.getLastItemInTimeDropdown(endTimePickerInput)).toBe(
    "11:00 pm"
  );
  expect(await formPage.getFirstItemInTimeDropdown(endTimePickerInput)).toBe(
    "7:15 am"
  );
});

test("Secondary date picker is disabled (locked to primary date)", async ({
  page,
}) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.setDateTo7DaysFromNow(0);
  await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
  await formPage.selectTime(formPage.endTimePicker(0), "5:00 pm");
  await formPage.yesRadio.click();
  let datePickerInput0 = formPage.datePicker(1);
  datePickerInput0 = datePickerInput0.locator("input");
  const datePickerInput0Value = await datePickerInput0.inputValue();

  let datePicker1 = formPage.datePicker(1);
  let datePicker1Input = datePicker1.locator("input");
  const datePickerInput1Value = await datePicker1Input.inputValue();

  expect(datePickerInput0Value).toBe(datePickerInput1Value);
  await expect(datePicker1).toHaveClass(/p-calendar-disabled/);
});

test("Secondary start time must be >= Primary end time", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.setDateTo7DaysFromNow(0);
  await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
  await formPage.selectTime(formPage.endTimePicker(0), "5:00 pm");
  await formPage.yesRadio.click();

  const firstTime = await formPage.getFirstItemInTimeDropdown(
    formPage.startTimePicker(1)
  );
  expect(firstTime).toBe("5:00 pm");
});

test("Show error if total duration between both events < 4 hours", async ({
  page,
}) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.setDateTo7DaysFromNow(0);

  await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
  await formPage.selectTime(formPage.endTimePicker(0), "8:00 am");

  await formPage.yesRadio.click();

  await formPage.selectTime(formPage.startTimePicker(1), "8:00 am");
  await formPage.selectTime(formPage.endTimePicker(1), "9:00 am");

  await formPage.submit();

  await expect(formPage.errorMessage).toHaveText(
    "The total duration between both events must be greater than 4 hours"
  );
});

test("Show error if total duration between both events > 10 hours", async ({
  page,
}) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.setDateTo7DaysFromNow(0);

  await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
  await formPage.selectTime(formPage.endTimePicker(0), "11:00 am");

  await formPage.yesRadio.click();

  await formPage.selectTime(formPage.startTimePicker(1), "11:00 am");
  await formPage.selectTime(formPage.endTimePicker(1), "9:00 pm");

  await formPage.submit();

  await expect(formPage.errorMessage).toHaveText(
    "The total duration between both events must be less than 10 hours"
  );
});

test("Show error if primary event duration < 4 hours", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.setDateTo7DaysFromNow(0);

  await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
  await formPage.selectTime(formPage.endTimePicker(0), "8:00 am");

  await formPage.submit();

  await expect(formPage.errorMessage).toHaveText(
    "The total duration of the event must be greater than 4 hours"
  );
});

test("Show error if primary event duration > 10 hours", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.setDateTo7DaysFromNow(0);

  await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
  await formPage.selectTime(formPage.endTimePicker(0), "11:00 pm");

  await formPage.submit();

  await expect(formPage.errorMessage).toHaveText(
    "The total duration of the event must be less than 10 hours"
  );
});

test("Changing primary date sets secondary date", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.setDateTo7DaysFromNow(0);

  await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
  await formPage.selectTime(formPage.endTimePicker(0), "11:00 am");

  await formPage.yesRadio.click();

  let datePickerInput0 = formPage.datePicker(1);
  datePickerInput0 = datePickerInput0.locator("input");
  const datePickerInput0Value = await datePickerInput0.inputValue();

  let datePicker1 = formPage.datePicker(1);
  let datePicker1Input = datePicker1.locator("input");
  const datePickerInput1Value = await datePicker1Input.inputValue();

  expect(datePickerInput0Value).toBe(datePickerInput1Value);
  await expect(datePicker1).toHaveClass(/p-calendar-disabled/);

  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 9);
  await formPage.writeDate(newDate, 0);

  expect(datePickerInput0Value).toBe(datePickerInput1Value);
});

test("Changing primary end time recalculates secondary time limits", async ({
  page,
}) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.setDateTo7DaysFromNow(0);

  await formPage.selectTime(formPage.startTimePicker(0), "7:00 am");
  await formPage.selectTime(formPage.endTimePicker(0), "11:00 am");

  await formPage.yesRadio.click();

  expect(
    await formPage.getFirstItemInTimeDropdown(formPage.startTimePicker(1))
  ).toBe("11:00 am");

  await formPage.selectTime(formPage.endTimePicker(0), "9:00 am");

  expect(
    await formPage.getFirstItemInTimeDropdown(formPage.startTimePicker(1))
  ).toBe("9:00 am");
});
