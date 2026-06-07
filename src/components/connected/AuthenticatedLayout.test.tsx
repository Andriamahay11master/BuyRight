import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AuthenticatedLayout from "./AuthenticatedLayout";

const mockChildren = <div>Test Children</div>;
describe("AuthenticatedLayout component", () => {
  it("renders the Navbar and children components", () => {
    render(<AuthenticatedLayout>{mockChildren}</AuthenticatedLayout>);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("children")).toBeInTheDocument();
  });
});
