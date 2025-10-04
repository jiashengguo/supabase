// Mock project hook for studio-clone
export function useSelectedProjectQuery() {
  // Mock project data for development
  return {
    data: {
      ref: 'default',
      name: 'Default Project',
      connectionString: null, // Will be provided by pg-meta API
    },
    isLoading: false,
    isSuccess: true,
    isError: false,
  }
}

export function useParams() {
  // Mock params for development - in real implementation this would use next/router
  return {
    ref: 'default',
    id: undefined as number | undefined,
  }
}
