import DateTimePicker from "@/app/components/datetime-picker";
import { BookingClass } from "@/app/models/Booking";
import { useDeepState } from "@/app/utils/useDeepState";
import { test, expect } from "@playwright/test";
import { FormPage } from "./pages/form-page";

test("Children defaults to 1", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await expect(formPage.childrenSelector(1)).toHaveClass(/active/);
});

test("Infants default to 0", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await expect(formPage.infantSelector(0)).toHaveClass(/active/);
});

test("Maximum infants allowed = number of children selected", async ({
  page,
}) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await expect(await formPage.getHighestInfantCount()).toBe(
    "infant-selector-1"
  );
  await formPage.childrenSelector(4).click();
  await expect(await formPage.getHighestInfantCount()).toBe(
    "infant-selector-4"
  );
});

test("Tabbing moves through selectors", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.childrenSelector(1).click();
  await page.keyboard.press("Tab");
  await expect(formPage.childrenSelector(2)).toBeFocused();
});

test("Space selects values", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.childrenSelector(1).click();
  await page.keyboard.press("Tab");
  await expect(formPage.childrenSelector(2)).toBeFocused();
  await expect(formPage.childrenSelector(2)).not.toHaveClass(/active/);
  await page.keyboard.press("Space");
  await expect(formPage.childrenSelector(2)).toHaveClass(/active/);
});

test("Reduces infants when infants > children", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.childrenSelector(4).click();
  await expect(await formPage.getHighestInfantCount()).toBe(
    "infant-selector-4"
  );
  await formPage.childrenSelector(2).click();
  await expect(await formPage.getHighestInfantCount()).toBe(
    "infant-selector-2"
  );
});

test("Resets toddler values when children count is changed", async ({
  page,
}) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.childrenSelector(4).click();
  await formPage.infantSelector(3).click();
  await expect(formPage.childrenSelector(4)).toHaveClass(/active/);
  await expect(formPage.infantSelector(3)).toHaveClass(/active/);
  await formPage.childrenSelector(2).click();
  await expect(formPage.infantSelector(0)).toHaveClass(/active/);
  await expect(await formPage.getHighestInfantCount()).toBe(
    "infant-selector-2"
  );
});
