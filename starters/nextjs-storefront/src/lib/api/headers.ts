export function workspaceHeaders(workspaceId: string): HeadersInit {
  return workspaceId ? { "x-workspace-id": workspaceId } : {};
}

export function jsonHeaders(workspaceId: string, token?: string | null): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...workspaceHeaders(workspaceId),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function bearerHeaders(token: string | null, workspaceId?: string): HeadersInit {
  return {
    ...(workspaceId ? workspaceHeaders(workspaceId) : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
