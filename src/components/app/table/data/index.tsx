import { fakeMessageDescriptor } from "translations/fake";

import type { ITableColumn } from "../types";

export const TABLE_DATA = {
  data: {
    data: [
      {
        id: 1,
        name: "React",
        age: 27,
        verified: "true",
        approved: "pending",
        role: "Admin",
        author: "Facbook",
        createdAt: "2032-08-17T11:29:57.330Z",
      },
      {
        id: 2,
        name: "Angular",
        age: 28,
        verified: "true",
        role: "Editor",
        approved: "progress",
        author: "Goggle",
        createdAt: "2022-08-17T11:29:57.330Z",
      },
      {
        id: 3,
        name: "Vue",
        age: 29,
        role: "User",
        verified: "false",
        approved: "done",
        author: "Evan Yue",
        createdAt: "2021-08-17T11:29:57.330Z",
      },
    ],
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 200,
  },
  isLoading: false,
  error: false,
  isPlaceholderData: false,
};

export const TABLE_COLUMNS: ITableColumn[] = [
  {
    Header: fakeMessageDescriptor("Id"),
    accessor: "id",
    filter: { _type: "idField", bag: undefined },
  },
  {
    Header: fakeMessageDescriptor("Name Header"),
    accessor: "name",
    filter: { _type: "string", bag: undefined },
  },
  {
    Header: fakeMessageDescriptor("Age"),
    accessor: "age",
    filter: { _type: "number", bag: undefined },
  },
  {
    Header: fakeMessageDescriptor("Verified"),
    accessor: "verified",
    disableSortBy: true,
    filter: {
      _type: "boolean",
      bag: [
        {
          color: "#00ff00",
          label: fakeMessageDescriptor("Yes"),
          value: "true",
        },
        {
          color: "#ff0000",
          label: fakeMessageDescriptor("No"),
          value: "false",
        },
      ],
    },
  },
  {
    Header: fakeMessageDescriptor("Role"),
    accessor: "role",
    disableSortBy: true,
    filter: {
      _type: "status",
      bag: [
        {
          color: "#00ff00",
          label: fakeMessageDescriptor("Admin"),
          value: "admin",
        },
        {
          color: "#fff000",
          label: fakeMessageDescriptor("Editor"),
          value: "editor",
        },
        {
          color: "#fff000",
          label: fakeMessageDescriptor("User"),
          value: "user",
        },
        {
          color: "#ff00f0",
          label: fakeMessageDescriptor("Developer"),
          value: "developer",
        },
      ],
    },
  },
  {
    Header: fakeMessageDescriptor("Author"),
    accessor: "author",
    filter: {
      _type: "list",
      bag: "http://localhost:3000/roles",
    },
  },
  {
    Header: fakeMessageDescriptor("Registered"),
    accessor: "createdAt",
    filter: {
      _type: "date",
      bag: undefined,
    },
  },
  {
    Header: fakeMessageDescriptor("Actions"),
    accessor: "__action__",
    disableSortBy: true,
    Cell: () => <span>Some Action</span>,
  },
];
