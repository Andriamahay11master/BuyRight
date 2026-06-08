import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProtectedRoute from "./ProtectedRoute";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe("ProtectedRoute component", () => {
  it("shows loader while authentication is loading", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Page</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("redirects to login when user is not authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Profile</div>
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
