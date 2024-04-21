import { ITableColumn } from "../types";

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
    Header: "Id",
    accessor: "id",
    filter: { _type: "idField", bag: undefined },
  },
  {
    Header: "Name Header",
    accessor: "name",
    filter: { _type: "string", bag: undefined },
  },
  {
    Header: "Age",
    accessor: "age",
    filter: { _type: "number", bag: undefined },
  },
  {
    Header: "Verified",
    accessor: "verified",
    disableSortBy: true,
    filter: {
      _type: "boolean",
      bag: [
        { color: "#00ff00", label: "Yes", value: "true" },
        { color: "#ff0000", label: "No", value: "false" },
      ],
    },
  },
  {
    Header: "Role",
    accessor: "role",
    disableSortBy: true,
    filter: {
      _type: "status",
      bag: [
        { color: "#00ff00", label: "Admin", value: "admin" },
        { color: "#fff000", label: "Editor", value: "editor" },
        { color: "#fff000", label: "User", value: "user" },
        { color: "#ff00f0", label: "Developer", value: "developer" },
      ],
    },
  },
  {
    Header: "Author",
    accessor: "author",
    filter: {
      _type: "list",
      bag: "http://localhost:3000/roles",
    },
  },
  {
    Header: "Registered",
    accessor: "createdAt",
    filter: {
      _type: "date",
      bag: undefined,
    },
  },
  {
    Header: "Actions",
    accessor: "__action__",
    disableSortBy: true,
    Cell: () => <span>Some Action</span>,
  },
];
