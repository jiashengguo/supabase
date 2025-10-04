// Mock implementation for now
export interface ExecuteSqlError extends Error {
  message: string
  code?: string
}

export interface ExecuteSqlArgs {
  projectRef?: string
  connectionString?: string | null
  sql: string
  queryKey?: string[]
}

export async function executeSql(
  { projectRef, connectionString, sql, queryKey }: ExecuteSqlArgs,
  signal?: AbortSignal
): Promise<{ result: any[] }> {
  // Mock implementation - in real app this would call the pg-meta API at localhost:8000
  console.log('Executing SQL:', sql)

  // Return mock data for now
  return {
    result: [],
  }
}
