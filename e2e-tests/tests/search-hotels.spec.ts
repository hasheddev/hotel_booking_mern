import { test, expect } from '@playwright/test';
import path from "path";

const UI_URL = "http://localhost:5173/";



test.beforeEach(async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByRole("link", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.locator("[name=email]").fill("1@1.com");
    await page.locator("[name=password]").fill("password");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Sign in Successful")).toBeVisible();
});


test("Should show hotel search results", async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("where are you going?").fill("Dublin");
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page.getByText("Hotels found in Dublin")).toBeVisible();
    await expect(page.getByText("Dublin Getaways")).toBeVisible();
});


test("Should show hotel detail", async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("where are you going?").fill("Dublin");
    await page.getByRole("button", { name: "Search" }).click();

    await page.getByText("Dublin Getaways").click();
    await expect(page).toHaveURL(/detail/);
    await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});

test("Should show book hotel", async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("where are you going?").fill("Dublin");
    const date = new Date;
    date.setDate(date.getDate() + 3);
    const formatedDate = date.toISOString().split("T")[0];

    await page.getByPlaceholder("Check-Out Date").fill(formatedDate);
    await page.getByRole("button", { name: "Search" }).click();

    await page.getByText("Dublin Getaways").click();

    await page.getByRole("button", { name: "Book now" }).click();
    await expect(page.getByText("Total Cost: $350.00")).toBeVisible();

    const stripeFrame = page.frameLocator("iframe").first();
    await stripeFrame.locator('[placeholder="Card number"]').fill("4242424242424242");
    await stripeFrame.locator('[placeholder]="MM / YY"').fill("05/28");
    await stripeFrame.locator('[placeholder]="CVC"').fill("937");
    await stripeFrame.locator('[placeholder]="ZIP"').fill("24225");

    await page.getByRole("button", { name: "Confirm Booking" }).click();
    await expect(page.getByText("Booking Saved!")).toBeVisible();

    await page.getByRole("link", { name: "My Bookings" }).click();
    await expect(page.getByText("Dublin Getaways")).toBeVisible();
});