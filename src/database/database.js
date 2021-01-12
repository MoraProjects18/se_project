const mysql = require("mysql");
const config = require("config");
const _pool = new WeakMap();
const _connectionError = new WeakMap();
const _getResults = new WeakMap();

class Database {
  constructor() {
    try {
      _pool.set(this, mysql.createPool(config.get("database_credentials")));
      _connectionError.set(this, false);
    } catch (ex) {
      console.log(ex);
      _connectionError.set(this, true);
    }

    _getResults.set(this, (error, results, fields) => {
      if (error) {
        console.log(error);
        resolve({ error: true });
      }
      resolve({ error: false, result: results });
    });
  }

  get connectionError() {
    return _connectionError.get(this);
  }

  //Insert new tuples into database
  create(tableName, columns, values) {
    return new Promise((resolve) => {
      _pool
        .get(this)
        .query(
          `INSERT INTO ?? ${columns.length === 0 ? "" : "(??)"} VALUES ${
            typeof values[0] === "object" ? "?" : "(?)"
          }`,
          [tableName, columns, values],
          _getResults.get(this)(error, results, fields)
        );
    });
  }

  //read data from single table
  readSingleTable(tableName, columns, action = [], sort = [], limit = []) {
    return new Promise((resolve) => {
      _pool
        .get(this)
        .query(
          `SELECT ?? FROM ?? ${
            action.length === 0 ? `` : `WHERE ?? ${action[1]} ?`
          } ${sort.length === 0 ? `` : `ORDER BY ??`} ${
            limit.length == 0 ? `` : `LIMIT ?`
          }`,
          [columns, tableName, action[0], action[2], sort, limit],
          _getResults.get(this)(error, results, fields)
        );
    });
  }

  //read data from multiple tables using join operators
  readMultipleTable(
    mainTable,
    join,
    joiningTables,
    columns,
    action = [],
    sort = [],
    limit = []
  ) {
    return new Promise((resolve) => {
      _pool
        .get(this)
        .query(
          `SELECT ?? FROM ?? ${joiningTables
            .map((e, i) =>
              i % 2 === 0
                ? `${join === "outer" ? `LEFT` : ``} JOIN ?? USING (??)`
                : ``
            )
            .join("")} ${
            action.length === 0 ? `` : `WHERE ?? ${action[1]} ?`
          } ${sort.length === 0 ? `` : `ORDER BY ??`} ${
            limit.length == 0 ? `` : `LIMIT ?`
          }`,
          [
            columns,
            mainTable,
            ...joiningTables,
            action[0],
            action[2],
            sort,
            limit,
          ],
          _getResults.get(this)(error, results, fields)
        );
    });
  }

  //update a table
  update(tableName, updates, action = []) {
    return new Promise((resolve) => {
      _pool
        .get(this)
        .query(
          `UPDATE ?? SET ${updates
            .map((e, i) =>
              i % 2 === 0 ? `?? = ?` : `${i === updates.length - 1 ? `` : `,`}`
            )
            .join("")} WHERE ?? ${action[1]} ?`,
          [tableName, ...updates, action[0], action[2]],
          _getResults.get(this)(error, results, fields)
        );
    });
  }

  //delete tuples from a table
  delete(tableName, action) {
    return new Promise((resolve) => {
      _pool
        .get(this)
        .query(
          `DELETE FROM ?? WHERE ?? ${action[1]} ?`,
          [tableName, action[0], action[2]],
          _getResults.get(this)(error, results, fields)
        );
    });
  }

  //for call the stored procedures
  call(name, args = []) {
    return new Promise((resolve) => {
      _pool
        .get(this)
        .query(
          `CALL ??(?)`,
          [name, args],
          _getResults.get(this)(error, results, fields)
        );
    });
  }
}

module.exports = Database;
