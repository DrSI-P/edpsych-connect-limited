
// Define ApiError directly in this file to avoid re-export issues
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// Define validateRequiredFields directly here
export function validateRequiredFields(obj: Record<string, any>, fields: string[]): void {
  const missingFields = fields.filter(field => !obj[field]);
  if (missingFields.length > 0) {
    throw new ApiError(`Missing required fields: ${missingFields.join(', ')}`, 400);
  }
}

export type Handler = (req: any, res: any) => Promise<void> | void;

export function apiHandler(handler: Handler) {
  return async (req: any, res: any) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.error('API Handler Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
