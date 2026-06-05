import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Modal from "./Modal";

const mockOnClose = vi.fn();
describe("Modal component", () => {
  it("renders the modal with title and children", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("does not render the modal when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );
    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
