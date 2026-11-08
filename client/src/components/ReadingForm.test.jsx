import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import ReadingForm from "./ReadingForm";

describe("ReadingForm", () => {
  test("renders glucose input and all four slots", () => {
    render(
      <ReadingForm
        editing={null}
        onSave={vi.fn()}
        onCancel={vi.fn()}
        error=""
      />
    );

    expect(
      screen.getByLabelText(/Glucose/i)
    ).toBeInTheDocument();

    expect(screen.getByText("Morning")).toBeInTheDocument();
    expect(
      screen.getByText("After breakfast")
    ).toBeInTheDocument();
    expect(
      screen.getByText("After lunch")
    ).toBeInTheDocument();
    expect(
      screen.getByText("After dinner")
    ).toBeInTheDocument();
  });
});
