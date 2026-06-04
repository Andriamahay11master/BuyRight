import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loader from "./Loader";

describe("Loader", () => {
  it("renders the loader component", () => {
    render(<Loader />);
    const loader = screen.getByTestId("loader");
    expect(loader).toBeInTheDocument();
  });

  it("applies the correct size and color", () => {
    render(<Loader size="medium" color="#ff0000" />);
    const loaderIcon = screen.getByTestId("loader").querySelector("svg");
    expect(loaderIcon).toHaveStyle("font-size: 1.5rem");
    expect(loaderIcon).toHaveStyle("color: #ff0000");
  });
});
