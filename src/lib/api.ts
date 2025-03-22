
import { authApi } from './api/auth';
import { eventsApi } from './api/events';
import { submissionsApi } from './api/submissions';
import { paymentsApi } from './api/payments';
import { usersApi } from './api/users';

// Re-export all API modules
export const api = {
  auth: authApi,
  events: eventsApi,
  submissions: submissionsApi,
  payments: paymentsApi,
  users: usersApi,
};
