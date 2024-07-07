/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import * as React from "react";

import CredentialsSetup from "@/pages/setup/credentials";
import { BASE_TEST_URL } from "@/tests/api/handlers/_utils";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { queryCache, TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

import { getToastMessage } from "../_/utils";

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

    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        replaceMock,
      })
    );

    const { container } = render(
      <TestProviders>
        <CredentialsSetup />
      </TestProviders>
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

    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        replaceMock,
      })
    );

    const { container } = render(
      <TestProviders>
        <CredentialsSetup />
      </TestProviders>
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
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          replaceMock,
        })
      );

      const { container } = render(
        <TestProviders>
          <CredentialsSetup />
        </TestProviders>
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

      expect(await getToastMessage()).toBe(
        "Credentials Was Successfully Setup"
      );

      expect(replaceMock).toHaveBeenCalledWith("/setup/user", "/setup/user", {
        locale: "en",
      });
    });
  });

  describe.each(POSTGRES_MYSQL_MSSQL)("$title", ({ port, title }) => {
    it("should submit connection successfully", async () => {
      const replaceMock = jest.fn();
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          replaceMock,
        })
      );

      const { container } = render(
        <TestProviders>
          <CredentialsSetup />
        </TestProviders>
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
      await userEvent.type(screen.getByLabelText("Database"), "dashpress");

      await userEvent.clear(screen.getByLabelText("Port"));

      await userEvent.type(screen.getByLabelText("Port"), "8080");

      await userEvent.click(
        screen.getByRole("button", { name: "Setup Credentials" })
      );

      expect(replaceMock).toHaveBeenCalledWith("/setup/user", "/setup/user", {
        locale: "en",
      });
    });

    it("should submit connection through URL successfully", async () => {
      const replaceMock = jest.fn();

      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          replaceMock,
        })
      );
      const { container } = render(
        <TestProviders>
          <CredentialsSetup />
        </TestProviders>
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

      expect(replaceMock).toHaveBeenCalledWith("/setup/user", "/setup/user", {
        locale: "en",
      });
    });
  });

  describe("redirect", () => {
    beforeAll(() => {
      queryCache.clear();
    });

    it("should redirect to users page DB credentials is set", async () => {
      const replaceMock = jest.fn();

      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          replaceMock,
        })
      );

      server.use(
        rest.get(BASE_TEST_URL("/api/setup/check"), async (_, res, ctx) => {
          return res(
            ctx.json({
              hasUsers: false,
              hasDbCredentials: true,
            })
          );
        })
      );

      render(
        <TestProviders>
          <CredentialsSetup />
        </TestProviders>
      );
      await waitFor(() => {
        expect(replaceMock).toHaveBeenCalledWith("/setup/user", "/setup/user", {
          locale: "en",
        });
      });
    });
  });
});
