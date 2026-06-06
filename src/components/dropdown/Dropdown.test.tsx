import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Dropdown from "./Dropdown";

describe("Dropdown component", () => {
  const mockOnChange = vi.fn();
  const mockOnToggle = vi.fn();
  const mockOnClose = vi.fn();

  it("renders the dropdown button and list items", () => {
    render(
      <Dropdown
        valueBtn="Test"
        listItems={["Option 1", "Option 2", "Option 3"]}
        isOpen={true}
        onChange={mockOnChange}
        onToggle={mockOnToggle}
        onClose={mockOnClose}
      />,
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });
});
