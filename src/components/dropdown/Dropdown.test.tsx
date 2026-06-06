import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  const user = userEvent.setup();
  it("calls onChange and onClose when a list item is clicked", async () => {
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
    const option1 = screen.getByText("Option 1");
    expect(option1).toBeInTheDocument();
    await user.click(option1);
    expect(mockOnChange).toHaveBeenCalledWith("Option 1");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onToggle when the dropdown button is clicked and isOpen is true", async () => {
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
    const dropdownButton = screen.getByText("Test");
    expect(dropdownButton).toBeInTheDocument();
    await user.click(dropdownButton);
    expect(mockOnToggle).toHaveBeenCalled();
  });

  it("When the dropdown is open, there should be a class of 'open' on the dropdown div", () => {
    const { container } = render(
      <Dropdown
        valueBtn="Test"
        listItems={["Option 1", "Option 2", "Option 3"]}
        isOpen={true}
        onChange={mockOnChange}
        onToggle={mockOnToggle}
        onClose={mockOnClose}
      />,
    );
    const dropdownDiv = container.querySelector(".dropdown");
    expect(dropdownDiv).toHaveClass("open");
  });
});
