import { User } from "@/stores/store";

export function getUsers(): Array<User> {
  return [
    {
      companyId: 1,
      email: "testerOne@tractian.com",
      id: 1,
      name: "John Doe",
      unitId: 1,
    },
    {
      companyId: 1,
      email: "testerTwo@tractian.com",
      id: 2,
      name: "Jane Doe",
      unitId: 1,
    },
    {
      companyId: 1,
      email: "testerThree@tractian.com",
      id: 3,
      name: "Bob Smith",
      unitId: 1,
    },
    {
      companyId: 1,
      email: "testerFour@tractian.com",
      id: 4,
      name: "Sarah Johnson",
      unitId: 1,
    },
    {
      companyId: 1,
      email: "testerFive@tractian.com",
      id: 5,
      name: "Tim Brown",
      unitId: 2,
    },
  ];
}
