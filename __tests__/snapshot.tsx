import { render } from "@testing-library/react";
import Home from "../src/app/page";
import { mockFetch } from "../__tests_data__/fetch";

describe("Snapshot", () => {
  beforeEach(() => {
    window.fetch = jest.fn().mockImplementation(() => mockFetch());
  });

  it("renders homepage unchanged", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
