type Tokens = {
  access: string;
  refresh: string;
};

type ApiErrorPayload = Record<string, unknown>;

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
let tokens: Tokens | null = null;

function getApiUrl(path: string) {
  if (!apiBaseUrl) {
    throw new Error('Set EXPO_PUBLIC_API_URL to the backend host before using account settings.');
  }
  return `${apiBaseUrl}/api/${path.replace(/^\/+/, '')}`;
}

function getErrorMessage(payload: unknown, status: number) {
  if (typeof payload === 'object' && payload !== null) {
    const body = payload as ApiErrorPayload;
    for (const key of ['detail', 'error', 'password', 'non_field_errors']) {
      const value = body[key];
      if (typeof value === 'string') return value;
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    }
    const firstValue = Object.values(body)[0];
    if (typeof firstValue === 'string') return firstValue;
    if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') return firstValue[0];
  }
  return `Request failed (${status}).`;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  authenticated = true,
): Promise<T | null> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('Content-Type', 'application/json');
  if (authenticated && tokens) headers.set('Authorization', `Bearer ${tokens.access}`);

  const response = await fetch(getApiUrl(path), { ...init, headers });
  if (response.status === 204) return null;

  const payload: unknown = await response.json();
  if (!response.ok) {
    if (response.status === 401 && authenticated) {
      tokens = null;
      throw new Error('Your session expired. Sign in again to continue.');
    }
    throw new Error(getErrorMessage(payload, response.status));
  }
  return payload as T;
}

export async function signIn(username: string, password: string) {
  const result = await request<Tokens>(
    'auth/login/',
    { method: 'POST', body: JSON.stringify({ username, password }) },
    false,
  );
  if (!result?.access || !result.refresh) {
    throw new Error('The server did not return a valid sign-in session.');
  }
  tokens = result;
}

export function clearSession() {
  tokens = null;
}

export type ProfileSettings = {
  ghost_mode: boolean;
  location_sharing: boolean;
  sharing_precision: 'city' | 'km' | 'exact';
  stop_sharing_after_minutes: number | null;
  notification_preferences: Record<string, boolean>;
};

export type Friendship = {
  id: number;
  to_user: { id: number; username: string };
};

export function getProfile() {
  return request<ProfileSettings>('profile/');
}

export function updateProfile(settings: Partial<ProfileSettings>) {
  return request<ProfileSettings>('profile/', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
}

export async function getBlockedUsers() {
  const response = await request<Friendship[] | { results: Friendship[] }>('blocked/');
  if (Array.isArray(response)) return response;
  return response?.results ?? [];
}

export function unblockUser(id: number) {
  return request<void>(`blocked/${id}/`, { method: 'DELETE' });
}

export function deleteAccount(password: string) {
  return request<void>('account/', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
}
