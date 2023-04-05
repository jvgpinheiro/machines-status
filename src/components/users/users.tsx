"use client";
import { User, usersAtom, workOrdersAtom } from "@/stores/store";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./users.module.css";

type CompleteUser = User & {
  orders: Array<any>;
  company: any;
};

export default function UsersComponent(): JSX.Element {
  const usersBaseData = useRecoilValue(usersAtom);
  const workOrdersData = useRecoilValue(workOrdersAtom);
  const [selectedUser, setSelectedUser] = useState<CompleteUser>();
  const [users, setCompleteUsers] = useState<Array<CompleteUser>>([]);

  useEffect(() => {
    window.addEventListener("click", () => setSelectedUser(undefined));
  }, []);

  useEffect(() => {
    const completeUsers = usersBaseData.map((sourceData) =>
      buildCompleteUser(sourceData)
    );
    setCompleteUsers(completeUsers);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersBaseData, workOrdersData]);

  function buildCompleteUser(user: User): CompleteUser {
    const workOrders = workOrdersData.filter((order) =>
      order.assignedUserIds.includes(user.id)
    );
    return {
      ...user,
      orders: workOrders,
      company: {},
    };
  }

  function makeUserPreview(user: CompleteUser): JSX.Element {
    function onUserPreviewClick(event: MouseEvent<HTMLDivElement>): void {
      event.preventDefault();
      event.stopPropagation();
      setSelectedUser(user);
    }

    return (
      <div
        className={styles.userPreview}
        data-testid="user-preview"
        onClick={(event) => onUserPreviewClick(event)}
      >
        <div data-testid="user-preview-name">{user.name}</div>
        <div data-testid="user-preview-email">{user.email}</div>
        <div data-testid="user-preview-company">{user.companyId}</div>
        <div data-testid="user-preview-orders">{user.orders.length}</div>
      </div>
    );
  }

  function makeUserDetailed(user: CompleteUser): JSX.Element {
    return (
      <div
        className={styles.userDetailed}
        data-testid="user-detailed"
        onClick={(event) => event.stopPropagation()}
      >
        <div data-testid="user-detailed-name">{user.name}</div>
        <div data-testid="user-detailed-email">{user.email}</div>
        <div data-testid="user-detailed-company">{user.companyId}</div>
        <div data-testid="user-detailed-orders-quantity">
          {`${user.orders.length} orders`}
        </div>
        <div data-testid="user-detailed-orders-list">
          {user.orders.map((order, index) => (
            <div key={index} data-testid="user-detailed-order">
              <div data-testid="user-detailed-order-title">
                Order title to implement
              </div>
              <div data-testid="user-detailed-order-status">
                Order status to implement
              </div>
              <div data-testid="user-detailed-order-priority">
                Order priority to implement
              </div>
              <div data-testid="user-detailed-order-more">
                Order more details to implement
              </div>
              <br></br>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.usersContainer} data-testid="users-container">
      {selectedUser && (
        <div
          className={styles.userDetailedContainer}
          data-testid="user-detailed-container"
        >
          {makeUserDetailed(selectedUser)}
        </div>
      )}

      <div
        className={styles.usersPreviewContainer}
        data-testid="users-preview-container"
      >
        {users.map((item) => (
          <div
            className={styles.userContent}
            key={item.id}
            data-testid="user-content"
          >
            {makeUserPreview(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
