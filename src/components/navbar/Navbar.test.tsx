import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
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
});
