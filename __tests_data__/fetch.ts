type MockResponse = { json: () => []; text: () => "" };
type MockFetch = {
  resolve: (response: MockResponse) => void;
  reject: (reason: any) => void;
};

const fetchCallsToSolve = new Set<MockFetch>();

export function mockFetch(): Promise<MockResponse> {
  return new Promise((resolve, reject) => {
    fetchCallsToSolve.add({ resolve, reject });
  });
}

export function solveFetchs(): void {
  fetchCallsToSolve.forEach((call) =>
    call.resolve({ json: () => [], text: () => "" })
  );
  fetchCallsToSolve.clear();
}
