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
    await expect(page.getByText("Hotesls found in Dublin")).toBeVisible();
    await expect(page.getByText("Dublin Getaways")).toBeVisible();
});