import { DocumentationRoot } from "./_base";

export function PersistentDocumentation() {
  return (
    <DocumentationRoot>
      <p>
        Persistent query is used to define a set of queries that are persisted
        on every query that is made to the database. This is useful when you
        want to enforce a set of rules on every query that is made to the
        database. Persistent query is attached for every select, insert, update,
        and delete query making sure that users can only access and manipulate
        the data that they are allowed to.
      </p>
      <p>
        For example, you can use persistent queries to enforce that all queries
        made on a certain entity have the user_id field set to the current
        user&apos;s id. This can be useful for enforcing row-level security.
      </p>
      <p>
        You can also use persistent queries to enforce that all data returned
        from an entity are not disabled, soft deleted, or archived.
      </p>
      <p>
        Persistent queries are fetched on the server and executed on the
        database.
      </p>
      <p>
        All the values in the persistent query support handlebars templating.
        You have access to the current user object through{" "}
        <code>{"{{ auth }}"}</code>.
      </p>
    </DocumentationRoot>
  );
}
