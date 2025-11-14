import { TestDatabaseSetup } from './database.setup';

export class TestInfrastructure {
  private readonly database: TestDatabaseSetup;

  constructor() {
    this.database = new TestDatabaseSetup();
  }

  async initialize(): Promise<void> {
    try {
      await this.database.createTable();
    } catch (error) {
      throw new Error(
        `Failed to initialize test infrastructure: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.database.cleanup();
    } catch (error) {
      console.warn(`Cleanup error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  getDatabase(): TestDatabaseSetup {
    return this.database;
  }
}

export const testInfra = new TestInfrastructure();
