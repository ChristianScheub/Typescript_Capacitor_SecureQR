import UsedLibsListContainer from "./container_usedLibList";
import {
  render,
  fireEvent,
  waitFor,
  screen
} from "@testing-library/react";

describe("UsedLibsListContainer", () => {
  test("renders button with correct text", () => {
    render(<UsedLibsListContainer />);
    const buttonElement = screen.getByTestId("usedLib_Open_Btn");
    expect(buttonElement).toBeInTheDocument();
  });

  test("clicking button opens modal", () => {
    render(<UsedLibsListContainer />);
    const buttonElement = screen.getByTestId("usedLib_Open_Btn");
    fireEvent.click(buttonElement);
    const modalElement = screen.getByTestId("used-lib-list-modal");
    expect(modalElement).toBeInTheDocument();
  });

  test("closing modal works correctly", async () => {
    render(<UsedLibsListContainer />);
    fireEvent.click(screen.getByTestId("usedLib_Open_Btn"));

    fireEvent.click(screen.getByTestId("close-btn-lib-list-modal"));

    await waitFor(() => {
      expect(screen.queryByTestId("used-lib-list-modal")).toBeNull();
    });
  });
});