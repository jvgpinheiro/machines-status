import { RecoilRoot } from "recoil";
import { RenderResult, render, screen, waitFor } from "@testing-library/react";
import WorkOrdersComponent from "@/components/workOrders/workOrders";
import { getWorkOrders } from "../../../__tests_data__/components/workOrders/workOrdersTestData";
import { workOrdersAtom, WorkOrder, WorkOrderStatus } from "@/stores/store";

const baseWorkOrders: Array<WorkOrder> = getWorkOrders();

function renderComponent(workOrders: Array<WorkOrder>): RenderResult {
  return render(
    <RecoilRoot
      initializeState={(snap) => snap.set(workOrdersAtom, workOrders)}
    >
      <WorkOrdersComponent></WorkOrdersComponent>);
    </RecoilRoot>
  );
}

function testQuantityOfCards(
  context: RenderResult,
  status: WorkOrderStatus,
  quantity: number
): void {
  const typeKey = status.replace(" ", "");
  const { getByTestId, queryAllByTestId } = context;
  getByTestId(`kanban-${typeKey}`);
  expect(queryAllByTestId(`kanban-${typeKey}-card`)).toHaveLength(quantity);
}

describe("WorkOrdersComponent", () => {
  describe("Base structure", () => {
    it("Test kanban structure", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(0, 1);
      const { getByTestId } = renderComponent(workOrders);
      getByTestId("container");
      getByTestId("kanban-container");
      getByTestId("kanban-todo");
      getByTestId("kanban-blocked");
      getByTestId("kanban-inprogress");
      getByTestId("kanban-completed");
    });
    it("Test simple card structure", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(0, 1);
      const { getByTestId } = renderComponent(workOrders);
      getByTestId("kanban-simple-card");
      getByTestId("kanban-simple-card-id");
      getByTestId("kanban-simple-card-title");
      getByTestId("kanban-simple-card-priority");
      getByTestId("kanban-simple-card-asset");
      getByTestId("kanban-simple-card-users");
    });
    it("Test complete card structure", async () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders.slice(0, 1);
      const { getByTestId, getAllByTestId } = renderComponent(workOrders);
      const simpleCard = getByTestId("kanban-simple-card");
      simpleCard.click();
      await waitFor(() => getByTestId("kanban-complete-card"));
      getByTestId("kanban-complete-card-id");
      getByTestId("kanban-complete-card-title");
      getByTestId("kanban-complete-card-priority");
      getByTestId("kanban-complete-card-asset");
      getByTestId("kanban-complete-card-description");
      getByTestId("kanban-complete-card-users");
      getAllByTestId("kanban-complete-card-users-user");
      getByTestId("kanban-complete-card-checklist");
      getAllByTestId("kanban-complete-card-task");
      getAllByTestId("kanban-complete-card-task-status");
      getAllByTestId("kanban-complete-card-task-icon");
    });
  });

  describe("To Do container", () => {
    it("Test kanban 0 to do cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "completed" }));
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "to do", 0);
    });
    it("Test kanban 1 to do cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "completed" }));
      workOrders[1].status = "to do";
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "to do", 1);
    });
    it("Test kanban 3 to do cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "to do" }));
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "to do", 3);
    });
  });

  describe("Blocked container", () => {
    it("Test kanban 0 blocked cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "completed" }));
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "blocked", 0);
    });
    it("Test kanban 1 blocked cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "completed" }));
      workOrders[1].status = "blocked";
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "blocked", 1);
    });
    it("Test kanban 3 blocked cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "blocked" }));
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "blocked", 3);
    });
  });

  describe("In progress container", () => {
    it("Test kanban 0 in progress cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "completed" }));
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "in progress", 0);
    });
    it("Test kanban 2 in progress cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "completed" }));
      workOrders[1].status = "in progress";
      workOrders[2].status = "in progress";
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "in progress", 2);
    });
    it("Test kanban 3 in progress cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "in progress" }));
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "in progress", 3);
    });
  });

  describe("Completed container", () => {
    it("Test kanban 0 completed cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "to do" }));
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "completed", 0);
    });
    it("Test kanban 2 completed cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "to do" }));
      workOrders[0].status = "completed";
      workOrders[1].status = "completed";
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "completed", 2);
    });
    it("Test kanban 3 completed cards", () => {
      const workOrders: Array<WorkOrder> = baseWorkOrders
        .slice(0, 3)
        .map((order) => ({ ...order, status: "completed" }));
      const renderResult = renderComponent(workOrders);
      testQuantityOfCards(renderResult, "completed", 3);
    });
  });
});
