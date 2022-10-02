/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { rest } from "msw";
import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import CredentialsSetup from "pages/setup/credentials";
import userEvent from "@testing-library/user-event";

const server = setupApiHandlers();

const POSTGRES_MYSQL_MSSQL: {
  title: string;
  port: number;
}[] = [
  {
    title: "Mysql",
    port: 3306,
  },
  {
    title: "Postgres",
    port: 5432,
  },
  {
    title: "Mssql",
    port: 1433,
  },
];

describe("pages/setup/credentials", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  beforeAll(() => {
    server.use(
      rest.get(BASE_TEST_URL("/api/setup/check"), async (_, res, ctx) => {
        return res(
          ctx.json({
            hasUsers: false,
            hasDbCredentials: false,
          })
        );
      })
    );
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it("should render only 'Database Type' input on load", async () => {
    localStorage.clear();
    const replaceMock = jest.fn();
    useRouter.mockImplementation(() => ({
      replace: replaceMock,
    }));

    const { container } = render(
      <AppWrapper>
        <CredentialsSetup />
      </AppWrapper>
    );

    expect(
      screen.queryByRole("button", { name: "Toggle Connection URL" })
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(container.querySelectorAll("label")).toHaveLength(1);
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("should toggle `connection URL` mode correctly on DB type selection", async () => {
    localStorage.clear();
    const replaceMock = jest.fn();
    useRouter.mockImplementation(() => ({
      replace: replaceMock,
    }));

    const { container } = render(
      <AppWrapper>
        <CredentialsSetup />
      </AppWrapper>
    );

    expect(
      screen.queryByRole("button", { name: "Toggle Connection URL" })
    ).not.toBeInTheDocument();

    await userEvent.type(
      await screen.findByLabelText("Database Type"),
      "Postgres"
    );

    await userEvent.keyboard("{Enter}");

    await userEvent.click(
      await screen.findByRole("button", { name: "Toggle Connection URL" })
    );

    expect(screen.getByLabelText("Connection URL")).toBeInTheDocument();

    await userEvent.type(
      await screen.findByLabelText("Database Type"),
      "Mysql"
    );

    await userEvent.keyboard("{Enter}");

    expect(screen.queryByLabelText("Connection URL")).not.toBeInTheDocument();

    expect(container.querySelectorAll("label")).toHaveLength(7);

    await userEvent.type(
      await screen.findByLabelText("Database Type"),
      "Mssql"
    );

    await userEvent.keyboard("{Enter}");

    await userEvent.click(
      await screen.findByRole("button", { name: "Toggle Connection URL" })
    );

    expect(screen.getByLabelText("Connection URL")).toBeInTheDocument();

    await userEvent.type(
      await screen.findByLabelText("Database Type"),
      "Sqlite"
    );

    await userEvent.keyboard("{Enter}");

    expect(screen.queryByLabelText("Connection URL")).not.toBeInTheDocument();
  });

  describe("Sqlite", () => {
    it("should submit connection successfully", async () => {
      const replaceMock = jest.fn();
      useRouter.mockImplementation(() => ({
        replace: replaceMock,
      }));

      const { container } = render(
        <AppWrapper>
          <CredentialsSetup />
        </AppWrapper>
      );

      await userEvent.type(
        await screen.findByLabelText("Database Type"),
        "Sqlite"
      );

      await userEvent.keyboard("{Enter}");

      expect(container.querySelectorAll("label")).toHaveLength(2);

      await userEvent.type(
        screen.getByLabelText("File Name"),
        "some-sqlite-file-name"
      );

      expect(
        screen.queryByRole("button", { name: "Toggle Connection URL" })
      ).not.toBeInTheDocument();

      await userEvent.click(
        screen.getByRole("button", { name: "Setup Credentials" })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Setup Credentials Created Successfully"
      );

      expect(replaceMock).toHaveBeenCalledWith("/setup/user");
    });
  });

  describe.each(POSTGRES_MYSQL_MSSQL)("$title", ({ port, title }) => {
    it("should submit connection successfully", async () => {
      const replaceMock = jest.fn();
      useRouter.mockImplementation(() => ({
        replace: replaceMock,
      }));

      const { container } = render(
        <AppWrapper>
          <CredentialsSetup />
        </AppWrapper>
      );

      await userEvent.type(
        await screen.findByLabelText("Database Type"),
        title
      );

      await userEvent.keyboard("{Enter}");

      expect(screen.getByLabelText("Port")).toHaveValue(port);

      expect(container.querySelectorAll("label")).toHaveLength(7);

      await userEvent.type(screen.getByLabelText("Host"), "127.0.0.1");
      await userEvent.type(screen.getByLabelText("User"), "root");
      await userEvent.type(screen.getByLabelText("Password"), "password");
      await userEvent.type(screen.getByLabelText("Database"), "hadmean");

      await userEvent.clear(screen.getByLabelText("Port"));

      await userEvent.type(screen.getByLabelText("Port"), "8080");

      await userEvent.click(
        screen.getByRole("button", { name: "Setup Credentials" })
      );

      expect(replaceMock).toHaveBeenCalledWith("/setup/user");
    });

    it("should submit connection through URL successfully", async () => {
      const replaceMock = jest.fn();
      useRouter.mockImplementation(() => ({
        replace: replaceMock,
      }));

      const { container } = render(
        <AppWrapper>
          <CredentialsSetup />
        </AppWrapper>
      );

      await userEvent.type(
        await screen.findByLabelText("Database Type"),
        title
      );

      await userEvent.keyboard("{Enter}");

      await userEvent.click(
        await screen.findByRole("button", { name: "Toggle Connection URL" })
      );

      expect(container.querySelectorAll("label")).toHaveLength(2);

      await userEvent.type(
        screen.getByLabelText("Connection URL"),
        "some-connection-url"
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Setup Credentials" })
      );

      expect(replaceMock).toHaveBeenCalledWith("/setup/user");
    });
  });
});
