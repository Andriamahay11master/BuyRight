import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

const user = userEvent.setup();

const MockedNavbar = () => {
  return (
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

const changeRouteNav = (valNav: string, link: string) => {
  const currentLink = screen.getByText(valNav);
  currentLink.click();
  expect(window.location.pathname).toBe(link);
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

  it("should change the route when a link is clicked", () => {
    render(<MockedNavbar />);
    changeRouteNav("Home", "/");
    changeRouteNav("Create", "/create");
    changeRouteNav("Profile", "/profile");
    changeRouteNav("Items", "/items");
  });

  it("should have the active class on the current link", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("active");
  });

  it("should update the active link when a different link is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>,
    );
    const createLink = screen.getByRole("link", { name: "Create" });
    await user.click(createLink);
    expect(createLink).toHaveClass("active");
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).not.toHaveClass("active");
  });
});
