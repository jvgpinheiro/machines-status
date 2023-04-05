import { MutableSnapshot, RecoilRoot } from "recoil";
import { RenderResult, render, waitFor } from "@testing-library/react";
import UsersComponent from "@/components/users/users";
import { getUsers } from "../../../__tests_data__/components/users/usersTestData";
import { usersAtom, workOrdersAtom, User, WorkOrder } from "@/stores/store";
import { getWorkOrders } from "../../../__tests_data__/components/workOrders/workOrdersTestData";

const baseUsers: Array<User> = getUsers();
const baseWorkOrders: Array<WorkOrder> = getWorkOrders();

function renderComponent(
  users: Array<User>,
  workOrders: Array<WorkOrder> = []
): RenderResult {
  function initSnapshot(snap: MutableSnapshot): void {
    snap.set(usersAtom, users);
    snap.set(workOrdersAtom, workOrders);
  }

  return render(
    <RecoilRoot initializeState={(snap) => initSnapshot(snap)}>
      <UsersComponent></UsersComponent>);
    </RecoilRoot>
  );
}

function testUsersQuantity(context: RenderResult, quantity: number): void {
  const { getAllByTestId, getByTestId } = context;
  const usersContainer = getByTestId("users-container");
  const usersPreviewContainer = getByTestId("users-preview-container");
  const userElements = getAllByTestId("user-content");
  expect(usersContainer).toBeInTheDocument();
  expect(usersPreviewContainer).toBeInTheDocument();
  expect(userElements).toHaveLength(quantity);
}

describe("UsersComponent", () => {
  it("Test 1 user preview", () => {
    const users: Array<User> = baseUsers.slice(0, 1);
    const renderResult = renderComponent(users);
    testUsersQuantity(renderResult, 1);
    testUsersQuantity(renderResult, users.length);
    expect(renderResult.queryByTestId("user-detailed-container")).toBeNull();
  });
  it("Test 2 users preview", () => {
    const users: Array<User> = baseUsers.slice(0, 2);
    const renderResult = renderComponent(users);
    testUsersQuantity(renderResult, 2);
    testUsersQuantity(renderResult, users.length);
    expect(renderResult.queryByTestId("user-detailed-container")).toBeNull();
  });
  it("Test 5 users preview", () => {
    const users: Array<User> = baseUsers.slice(0, 5);
    const renderResult = renderComponent(users);
    testUsersQuantity(renderResult, 5);
    testUsersQuantity(renderResult, users.length);
    expect(renderResult.queryByTestId("user-detailed-container")).toBeNull();
  });
  it("Test preview user structure", async () => {
    const users: Array<User> = baseUsers.slice(0, 1);
    const { getByTestId } = renderComponent(users);
    getByTestId("user-preview");
    getByTestId("user-preview-name");
    getByTestId("user-preview-email");
    getByTestId("user-preview-company");
    getByTestId("user-preview-orders");
  });
  it("Test detailed user structure without orders", async () => {
    const users: Array<User> = baseUsers.slice(0, 1);
    const { getByTestId, queryAllByTestId } = renderComponent(users);
    const userPreview = getByTestId("user-preview");

    userPreview.click();
    await waitFor(() => getByTestId("user-detailed-container"));
    getByTestId("user-detailed");
    getByTestId("user-detailed-name");
    getByTestId("user-detailed-email");
    getByTestId("user-detailed-company");
    getByTestId("user-detailed-orders-quantity");
    getByTestId("user-detailed-orders-list");
    expect(queryAllByTestId("user-detailed-order")).toHaveLength(0);
    expect(queryAllByTestId("user-detailed-order-title")).toHaveLength(0);
    expect(queryAllByTestId("user-detailed-order-status")).toHaveLength(0);
    expect(queryAllByTestId("user-detailed-order-priority")).toHaveLength(0);
    expect(queryAllByTestId("user-detailed-order-more")).toHaveLength(0);
  });
  it("Test detailed user structure with orders", async () => {
    const users: Array<User> = baseUsers.slice(0, 1);
    const workOrders: Array<WorkOrder> = baseWorkOrders.slice(0, 1);
    const { getAllByTestId, getByTestId } = renderComponent(users, workOrders);
    const userPreview = getByTestId("user-preview");

    userPreview.click();
    await waitFor(() => getByTestId("user-detailed-container"));
    getByTestId("user-detailed");
    getByTestId("user-detailed-name");
    getByTestId("user-detailed-email");
    getByTestId("user-detailed-company");
    getByTestId("user-detailed-orders-quantity");
    getByTestId("user-detailed-orders-list");
    getAllByTestId("user-detailed-order");
    getAllByTestId("user-detailed-order-title");
    getAllByTestId("user-detailed-order-status");
    getAllByTestId("user-detailed-order-priority");
    getAllByTestId("user-detailed-order-more");
  });
});
