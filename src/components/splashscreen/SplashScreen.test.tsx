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

  it("should display the correct progress", () => {
    render(<SplashScreen onComplete={mockOnComplete} />);
    const progressText = screen.getByText(/0%/i);
    expect(progressText).toBeInTheDocument();
  });

  it("calls onComplete after progress reaches 100%", () => {
    vi.useFakeTimers();
    render(<SplashScreen onComplete={mockOnComplete} />);
    vi.advanceTimersByTime(2000);
    expect(mockOnComplete).toHaveBeenCalledTimes(0);
    vi.useRealTimers();
  });
});
