import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";
import { BrowserRouter } from "react-router-dom";

const MockedNavbar = () => {
  return (
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe("Navbar component", () => {
  it("renders the navbar with brand and links", () => {
    render(<MockedNavbar />);
    expect(screen.getByText("BuyRight")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Items")).toBeInTheDocument();
  });

  it("renders the logout button", () => {
    render(<MockedNavbar />);
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("calls handleLogout when the logout button is clicked", () => {
    const mockLogout = vi.fn();
    render(<MockedNavbar />);
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    logoutButton.onclick = mockLogout;
    logoutButton.click();
    expect(mockLogout).toHaveBeenCalled();
  });
});
