"use client";
import {
  Asset,
  User,
  WorkOrder,
  WorkOrderStatus,
  assetsAtom,
  usersAtom,
  workOrdersAtom,
} from "@/stores/store";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./workOrders.module.css";
import { makeDefaultAsset, makeDefaultUser } from "@/utils/storeUtils";

type CompleteWorkOrder = WorkOrder & {
  asset: Asset;
  users: Array<User>;
};

export default function WorkOrdersComponent(): JSX.Element {
  const assetsData = useRecoilValue(assetsAtom);
  const usersBaseData = useRecoilValue(usersAtom);
  const workOrdersData = useRecoilValue(workOrdersAtom);
  const [toDoOrders, setToDoOrders] = useState<Array<CompleteWorkOrder>>([]);
  const [blockedOrders, setBlockedOrders] = useState<Array<CompleteWorkOrder>>(
    []
  );
  const [inProgressOrders, setInProgressOrders] = useState<
    Array<CompleteWorkOrder>
  >([]);
  const [completedOrders, setCompletedOrders] = useState<
    Array<CompleteWorkOrder>
  >([]);
  const [selectedOrder, setSelectedOrder] = useState<CompleteWorkOrder>();

  useEffect(() => {
    window.addEventListener("click", () => setSelectedOrder(undefined));
  }, []);

  useEffect(() => {
    const ordersByStatus = new Map<WorkOrderStatus, Array<CompleteWorkOrder>>(
      []
    );
    workOrdersData.forEach((order) => {
      const ordersFromStatus = ordersByStatus.get(order.status) ?? [];
      ordersFromStatus.push(buildCompleteWorkOrder(order));
      ordersByStatus.set(order.status, ordersFromStatus);
    });
    setToDoOrders(ordersByStatus.get("to do") ?? []);
    setBlockedOrders(ordersByStatus.get("blocked") ?? []);
    setInProgressOrders(ordersByStatus.get("in progress") ?? []);
    setCompletedOrders(ordersByStatus.get("completed") ?? []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workOrdersData]);

  function buildCompleteWorkOrder(workOrder: WorkOrder): CompleteWorkOrder {
    const foundAsset = assetsData.find(
      (asset) => asset.id === workOrder.assetId
    );
    const foundUsers = usersBaseData.filter((user) =>
      workOrder.assignedUserIds.includes(user.id)
    );
    return {
      ...workOrder,
      asset: foundAsset ?? makeDefaultAsset(),
      users: foundUsers.length ? foundUsers : [makeDefaultUser()],
    };
  }

  function makeToDoOrdersComponent(): JSX.Element {
    return (
      <div data-testid="kanban-todo">
        {toDoOrders.map((order) => (
          <div key={order.id} data-testid="kanban-todo-card">
            {makeSimpleCardComponent(order)}
          </div>
        ))}
      </div>
    );
  }

  function makeBlockedOrdersComponent(): JSX.Element {
    return (
      <div data-testid="kanban-blocked">
        {blockedOrders.map((order) => (
          <div key={order.id} data-testid="kanban-blocked-card">
            {makeSimpleCardComponent(order)}
          </div>
        ))}
      </div>
    );
  }

  function makeInProgressOrdersComponent(): JSX.Element {
    return (
      <div data-testid="kanban-inprogress">
        {inProgressOrders.map((order) => (
          <div key={order.id} data-testid="kanban-inprogress-card">
            {makeSimpleCardComponent(order)}
          </div>
        ))}
      </div>
    );
  }

  function makeCompletedOrdersComponent(): JSX.Element {
    return (
      <div data-testid="kanban-completed">
        {completedOrders.map((order) => (
          <div key={order.id} data-testid="kanban-completed-card">
            {makeSimpleCardComponent(order)}
          </div>
        ))}
      </div>
    );
  }

  function makeSimpleCardComponent(order: CompleteWorkOrder): JSX.Element {
    function onCardClick(event: MouseEvent<HTMLDivElement>): void {
      event.stopPropagation();
      event.preventDefault();
      setSelectedOrder(order);
    }

    return (
      <div
        data-testid="kanban-simple-card"
        onClick={(event) => onCardClick(event)}
      >
        <div data-testid="kanban-simple-card-id">{`ORDER-${order.id}`}</div>
        <div data-testid="kanban-simple-card-title">{order.title}</div>
        <div data-testid="kanban-simple-card-priority">{order.priority}</div>
        <div data-testid="kanban-simple-card-asset">{order.asset.name}</div>
        <div data-testid="kanban-simple-card-users">{`${order.assignedUserIds.length} users affected`}</div>
      </div>
    );
  }

  function makeCompleteCardComponent(order: CompleteWorkOrder): JSX.Element {
    return (
      <div data-testid="kanban-complete-card">
        <div data-testid="kanban-complete-card-id">{`ORDER-${order.id}`}</div>
        <div data-testid="kanban-complete-card-title">{order.title}</div>
        <div data-testid="kanban-complete-card-priority">{order.priority}</div>
        <div data-testid="kanban-complete-card-asset">{order.asset.name}</div>
        <div data-testid="kanban-complete-card-description">
          {order.description}
        </div>
        <div data-testid="kanban-complete-card-users">
          {order.users.map((user) => (
            <div
              key={user.id}
              data-testid="kanban-complete-card-users-user"
            >{`User: ${user.name}`}</div>
          ))}
        </div>
        <div data-testid="kanban-complete-card-checklist">
          {order.checklist.map((task) => (
            <div key={task.task} data-testid="kanban-complete-card-task">
              <div data-testid="kanban-complete-card-task-status">{`Task: ${task.task}`}</div>
              <div data-testid="kanban-complete-card-task-icon">{`Status: ${task.completed}`}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.workOrdersContainer} data-testid="container">
      {selectedOrder && (
        <div
          className={styles.workOrdersDetailedContainer}
          onClick={(event) => event.stopPropagation()}
        >
          {makeCompleteCardComponent(selectedOrder)}
        </div>
      )}
      <div data-testid="kanban-container">
        {makeToDoOrdersComponent()}
        {makeBlockedOrdersComponent()}
        {makeInProgressOrdersComponent()}
        {makeCompletedOrdersComponent()}
      </div>
    </div>
  );
}
