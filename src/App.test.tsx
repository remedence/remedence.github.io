import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Remedence public site", () => {
  it("states the verification-first product promise", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Security work. Proven complete.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("PATCHED ≠ VERIFIED FIXED").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText("Independent verification failed"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Secondary query path remained exploitable"),
    ).toBeInTheDocument();
  });

  it("publishes only truthful primary destinations", () => {
    render(<App />);

    const githubLinks = screen.getAllByRole("link", {
      name: /View on GitHub/i,
    });
    expect(githubLinks[0]).toHaveAttribute(
      "href",
      "https://github.com/remedence/remedence",
    );
    expect(
      screen.queryByRole("link", { name: /sign in/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /Persistent local core v1 is available on main with durable SQLite state, retained failed verification history, locked evidence, and immutable reports/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Planned only: Remedence Cloud is not implemented or available. No public pricing or launch date has been announced.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Local v1 has no user authentication."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No explicit product license has been published yet/),
    ).toBeInTheDocument();
  });

  it("shows the real product workflow with five descriptive screenshots", () => {
    render(<App />);

    const productSection = screen.getByRole("region", {
      name: "See Remedence in action",
    });
    const screenshots = within(productSection).getAllByRole("img");

    expect(screenshots).toHaveLength(5);
    expect(screenshots).toEqual([
      expect.objectContaining({
        alt: "Remedence dashboard showing the persisted security finding action queue",
      }),
      expect.objectContaining({
        alt: "Remedence finding detail showing remediation awaiting independent verification",
      }),
      expect.objectContaining({
        alt: "Remedence finding detail showing failed and passed independent verification history",
      }),
      expect.objectContaining({
        alt: "Remedence locked evidence view for a verified security fix",
      }),
      expect.objectContaining({
        alt: "Remedence immutable client report snapshot for a completed security review",
      }),
    ]);

    const expectedSources = [
      "/product/dashboard-action-queue.png",
      "/product/remediation-verification-workflow.png",
      "/product/failed-verification-history.png",
      "/product/evidence-verified-closure.png",
      "/product/immutable-report-snapshot.png",
    ];

    screenshots.forEach((image, index) => {
      expect(image).toHaveAttribute("src", expectedSources[index]);
      expect(image).toHaveAttribute("width", "1440");
      expect(image).toHaveAttribute("height", "900");
    });
  });

  it("exposes mobile navigation with an accessible toggle", async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
    expect(toggle).toHaveAttribute("aria-label", "Open navigation");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle!);

    expect(document.getElementById("mobile-navigation")).toHaveAttribute(
      "aria-label",
      "Mobile navigation",
    );
    expect(document.querySelector(".menu-toggle")).toHaveAttribute(
      "aria-label",
      "Close navigation",
    );
    expect(document.querySelector(".menu-toggle")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("closes mobile navigation on Escape and restores focus to the toggle", async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
    await user.click(toggle!);
    expect(document.getElementById("mobile-navigation")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(document.getElementById("mobile-navigation")).toBeNull();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("keeps responsive menu open through the mobile navigation breakpoint", async () => {
    const originalWidth = window.innerWidth;
    const user = userEvent.setup();

    try {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: 1000,
      });
      render(<App />);

      const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
      await user.click(toggle!);

      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: 1001,
      });
      fireEvent(window, new Event("resize"));
      expect(document.getElementById("mobile-navigation")).toBeInTheDocument();

      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: 1120,
      });
      fireEvent(window, new Event("resize"));
      expect(document.getElementById("mobile-navigation")).toBeNull();
    } finally {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: originalWidth,
      });
    }
  });
});
