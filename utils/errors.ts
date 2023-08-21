class IllegalSQLError extends Error {
    constructor(message?: string) {
      super(message ?? "Error genering sql from LLM");
      this.name = 'IllegalSqlError';
    }
  }
  