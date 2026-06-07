import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProtectedRoute from "./ProtectedRoute";
import { BrowserRouter } from "react-router-dom";

const mockChildren = <div>Protected Content</div>;
const MockAuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <BrowserRouter>
    <ProtectedRoute>{children}</ProtectedRoute>
  </BrowserRouter>
);
describe("ProtectedRoute component", () => {
  it("renders the children when authenticated", () => {
    render(<MockAuthenticatedLayout>{mockChildren}</MockAuthenticatedLayout>);
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
