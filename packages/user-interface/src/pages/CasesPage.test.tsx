import { describe, it, expect } from "vitest";
import CasesPage from "./CasesPage";

describe("CasesPage", () => {
  it("should render several cases", async () => {
    render(MockCasesPage());
    await expect(screen.getByText("Aanvraag Ooievaarspas"), {setTimeout: 5000}).toBeVisible();
    await expect(screen.getByText("2/1")).toBeVisible();
  });
});