const mongoose = require("mongoose");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.connectionString = "mongodb://127.0.0.1:27017/fake_so";
    this.isConnected = false;

    Database.instance = this;
  }

  async connect() {
    if (this.isConnected) {
      return;
    }

    await mongoose.connect(this.connectionString);
    this.isConnected = true;
  }

  disconnect() {
    if (this.isConnected) {
      mongoose.disconnect();
      this.isConnected = false;
    }
  }
}

const databaseInstance = new Database();

databaseInstance.connect();

module.exports = databaseInstance;
