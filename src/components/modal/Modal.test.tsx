import { render, screen } from "@testing-library/react";
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
});
