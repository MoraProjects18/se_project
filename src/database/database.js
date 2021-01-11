const mysql = require("mysql");
const config = require("config");
const _pool = new WeakMap();
const _connectionError = new WeakMap();

class Database {
  constructor() {
    try {
      _pool.set(this, mysql.createPool(config.get("database_credentials")));
      _connectionError.set(this, false);
    } catch (ex) {
      console.log(ex);
      _connectionError.set(this, true);
    }
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
          (error, results, fields) => {
            if (error) {
              console.log(error);
              resolve({ error: true });
            }
            resolve({ error: false });
          }
        );
    });
  }

  read() {}
}

module.exports = Database;
