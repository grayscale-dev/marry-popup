import DateTimePicker from "@/app/components/datetime-picker";
import { BookingClass } from "@/app/models/Booking";
import { useDeepState } from "@/app/utils/useDeepState";
import { test, expect } from "@playwright/test";

test("the component should render all fields", async ({ page }) => {
  await page.goto("");
  const elementIds = [
    "DatetimePickerComponent",
    "DayPicker",
    "StartTimePicker",
    "EndTimePicker",
    "DatePickerHelperText",
  ];
  for (const elementId of elementIds) {
    const element = await page.getByTestId(elementId);
    await expect(element).toBeVisible();
  }
});

test("dates before 7 days in the future should be disabled", async ({
  page,
}) => {
  await page.goto("");

  await page.getByTestId("DayPicker").click();

  const today = new Date();
  const sevenDaysFromToday = new Date(today);
  sevenDaysFromToday.setDate(today.getDate() + 7);

  const sevenDaysFromTodayDay = sevenDaysFromToday.getDate();
  const currentMonth = today.getMonth();
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1
  ).getMonth();

  const dayCells = page.locator('[data-pc-section="day"]');
  const dayCount = await dayCells.count();

  for (let i = 0; i < dayCount; i++) {
    const dayCell = dayCells.nth(i);

    const dayNumber = Number(await dayCell.getAttribute("data-p-day"));
    const monthNumber = Number(await dayCell.getAttribute("data-p-month"));
    const daySpan = dayCell.locator("span");

    const shouldBeDisabled =
      dayNumber < sevenDaysFromTodayDay ||
      monthNumber < currentMonth ||
      monthNumber === nextMonth;

    if (shouldBeDisabled) {
      await expect(
        daySpan,
        `Day ${dayNumber} (month ${monthNumber}) should be disabled`
      ).toHaveAttribute("aria-disabled", "true");
    } else {
      await expect(
        daySpan,
        `Day ${dayNumber} (month ${monthNumber}) should be enabled`
      ).toHaveAttribute("aria-disabled", "false");
    }
  }
});
