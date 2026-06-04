import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SplashScreen from "./SplashScreen";

const mockOnComplete = vi.fn();
describe("SplashScreen", () => {
  it("renders the splash screen", () => {
    render(<SplashScreen onComplete={mockOnComplete} />);
    const splashScreen = screen.getByTestId("splash-screen");
    expect(splashScreen).toBeInTheDocument();
  });
});
