import { RecoilRoot } from "recoil";
import { RenderResult, render, waitFor } from "@testing-library/react";
import MainApp, { AvailablePages } from "@/components/mainApp/mainApp";
import styles from "@/components/mainApp/mainApp.module.css";

type MockResponse = { json: () => []; text: () => "" };
type MockFetch = {
  resolve: (response: MockResponse) => void;
  reject: (reason: any) => void;
};

const fetchCallsToSolve = new Set<MockFetch>();
function mockFetch(): Promise<MockResponse> {
  return new Promise((resolve, reject) => {
    fetchCallsToSolve.add({ resolve, reject });
  });
}

function renderComponent(): RenderResult {
  return render(
    <RecoilRoot>
      <MainApp />
    </RecoilRoot>
  );
}

async function testPageSelection(
  context: RenderResult,
  option: AvailablePages
): Promise<void> {
  const { getByTestId } = context;
  window.fetch = jest.fn().mockImplementation(() => mockFetch());

  const navbarOption = getByTestId(`navbar-${option}-id`);
  getByTestId("body-id");
  navbarOption.click();
  await waitFor(() => expect(navbarOption).toHaveClass(styles.active));
  if (option !== "home") {
    await waitFor(() => getByTestId("loading-content-id"));
  }

  fetchCallsToSolve.forEach((call) =>
    call.resolve({ json: () => [], text: () => "" })
  );
  fetchCallsToSolve.clear();
  await waitFor(() => getByTestId("body-content-id"));
}

describe("Home", () => {
  it("Test navbar", () => {
    const { getByTestId } = renderComponent();
    const navbar = getByTestId("navbar-id");
    expect(navbar).toBeInTheDocument();
    expect(navbar.children).toHaveLength(5);
  });
  it("Test body content", () => {
    const { getByTestId } = renderComponent();
    const body = getByTestId("body-id");
    expect(body).toBeInTheDocument();
  });
  it("Test home content selected", async () => {
    const renderResult = renderComponent();
    await testPageSelection(renderResult, "home");
  });
  it("Test assets content selected", async () => {
    const renderResult = renderComponent();
    await testPageSelection(renderResult, "assets");
  });
  it("Test users content selected", async () => {
    const renderResult = renderComponent();
    await testPageSelection(renderResult, "users");
  });
  it("Test units content selected", async () => {
    const renderResult = renderComponent();
    await testPageSelection(renderResult, "units");
  });
  it("Test workOrders content selected", async () => {
    const renderResult = renderComponent();
    await testPageSelection(renderResult, "workOrders");
  });
});
