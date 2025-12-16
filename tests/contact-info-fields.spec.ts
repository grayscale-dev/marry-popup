import DateTimePicker from "@/app/components/datetime-picker";
import { BookingClass } from "@/app/models/Booking";
import { useDeepState } from "@/app/utils/useDeepState";
import { test, expect } from "@playwright/test";
import { FormPage } from "./pages/form-page";

test("Pressing Submit with empty fields outlines all 4 fields in red", async ({
  page,
}) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.submit();
  await expect(formPage.firstNameInput).toHaveClass(/p-invalid/);
  await expect(formPage.lastNameInput).toHaveClass(/p-invalid/);
  await expect(formPage.phoneInput).toHaveClass(/p-invalid/);
  await expect(formPage.emailInput).toHaveClass(/p-invalid/);
});

test("Filling each field individually removes its red outline", async ({
  page,
}) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.submit();
  await expect(formPage.firstNameInput).toHaveClass(/p-invalid/);
  await formPage.firstNameInput.fill("Zach");
  await expect(formPage.firstNameInput).not.toHaveClass(/p-invalid/);

  await expect(formPage.lastNameInput).toHaveClass(/p-invalid/);
  await formPage.lastNameInput.fill("Brown");
  await expect(formPage.lastNameInput).not.toHaveClass(/p-invalid/);

  await expect(formPage.phoneInput).toHaveClass(/p-invalid/);
  await formPage.phoneInput.pressSequentially("801-555-1234");
  await expect(formPage.phoneInput).not.toHaveClass(/p-invalid/);

  await expect(formPage.emailInput).toHaveClass(/p-invalid/);
  await formPage.emailInput.fill("test@test.test");
  await expect(formPage.emailInput).not.toHaveClass(/p-invalid/);
});

test("Email field remains invalid until it matches the @*.* pattern", async ({
  page,
}) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.submit();

  await expect(formPage.emailInput).toHaveClass(/p-invalid/);
  await formPage.emailInput.fill("test");
  await expect(formPage.emailInput).toHaveClass(/p-invalid/);
  await formPage.emailInput.fill("test@");
  await expect(formPage.emailInput).toHaveClass(/p-invalid/);
  await formPage.emailInput.fill("test@gmail");
  await expect(formPage.emailInput).toHaveClass(/p-invalid/);
  await formPage.emailInput.fill("test@gmail.");
  await expect(formPage.emailInput).toHaveClass(/p-invalid/);
  await formPage.emailInput.fill("test@gmail.com");
  await expect(formPage.emailInput).not.toHaveClass(/p-invalid/);
});

test("Phone number field does not allow letters", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.phoneInput.fill("a");
  await expect(formPage.phoneInput).not.toHaveValue("a");
});

test("Phone number uses masking xxx-xxx-xxxx", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.phoneInput.fill("801-555-1234");
  await expect(formPage.phoneInput).toHaveValue("801-555-1234");
});

test("First/Last name/email removes leading/trailing spaces", async ({
  page,
}) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await formPage.firstNameInput.fill(" Test ");
  await expect(formPage.firstNameInput).toHaveValue("Test");
  await formPage.lastNameInput.fill(" User ");
  await expect(formPage.lastNameInput).toHaveValue("User");
  await formPage.emailInput.fill(" test@test.com ");
  await expect(formPage.emailInput).toHaveValue("test@test.com");
});

test("Tab order: First Name → Last Name → Phone → Email", async ({ page }) => {
  await page.goto("");
  const formPage = new FormPage(page);
  await page.keyboard.press("Tab");
  await expect(formPage.firstNameInput).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(formPage.lastNameInput).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(formPage.phoneInput).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(formPage.emailInput).toBeFocused();
});
