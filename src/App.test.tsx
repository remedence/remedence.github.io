import { fireEvent, render, screen } from "@testing-library/react";
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
        "Public cloud availability and pricing will be published when they are ready.",
      ),
    ).toBeInTheDocument();
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
