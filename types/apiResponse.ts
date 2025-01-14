export interface ApiResponse {
    id?: number;
    name?: string;
    data?: {
      color?: string;
      price?: number;
      GPU?: string;
    };
    message?: string;
  }
  