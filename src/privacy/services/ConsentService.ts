export class ConsentService {
  static async getConsent(id: string) {
    // Placeholder: return fake consent
    return { id, status: 'granted' };
  }

  static async listConsents() {
    // Placeholder: return fake list
    return [{ id: '1', status: 'granted' }];
  }

  static async createConsent(data: any) {
    return { id: 'new', ...data };
  }

  static async updateConsent(id: string, data: any) {
    return { id, ...data };
  }
}