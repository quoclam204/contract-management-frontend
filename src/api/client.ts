const BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5028';

export class ApiError extends Error {
  constructor(
    public status: number,
    public endpoint: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.error ||
      errorData.message ||
      (errorData.errors
        ? typeof errorData.errors === 'object'
          ? Object.values(errorData.errors).flat().join(', ')
          : String(errorData.errors)
        : undefined) ||
      errorData.detail ||
      errorData.title ||
      `Request failed with status ${response.status}`;

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    throw new ApiError(response.status, endpoint, message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  },

  async getBlob(
    endpoint: string,
    options?: RequestInit
  ): Promise<{ blob: Blob; fileName?: string }> {
    const token = getAuthToken();

    const headers: HeadersInit = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData.error ||
        errorData.message ||
        `Request failed with status ${response.status}`;
      throw new ApiError(response.status, endpoint, message);
    }

    let fileName: string | undefined;
    const disposition = response.headers.get('content-disposition');
    if (disposition && disposition.includes('filename')) {
      const match = disposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i);
      if (match?.[1]) {
        fileName = decodeURIComponent(match[1]);
      }
    }

    const blob = await response.blob();
    return { blob, fileName };
  },
};
