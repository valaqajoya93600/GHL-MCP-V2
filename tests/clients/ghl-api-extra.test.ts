import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock axios instance
const mockInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
};

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => mockInstance)
  }
}));

import { GHLApiClient } from '../../src/clients/ghl-api-client.js';

describe('GHLApiClient extra endpoints (routes + headers)', () => {
  let client: GHLApiClient;

  const cfg = {
    accessToken: 'test_token',
    baseUrl: 'https://test.api',
    version: '2021-07-28',
    locationId: 'loc_test'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    client = new GHLApiClient(cfg as any);
  });

  it('adds Version 2021-04-15 header for Voice AI call logs', async () => {
    mockInstance.get.mockResolvedValueOnce({ data: { ok: true } });
    await client.listVoiceAICallLogs({ locationId: 'loc_x' });
    expect(mockInstance.get).toHaveBeenCalledWith(
      '/voice-ai/dashboard/call-logs',
      expect.objectContaining({
        params: expect.objectContaining({ locationId: 'loc_x' }),
        headers: expect.objectContaining({ Version: '2021-04-15' })
      })
    );
  });

  it('POSTs SaaS public enable with locationId in path', async () => {
    mockInstance.post.mockResolvedValueOnce({ data: { ok: true } });
    await client.saasPublicEnable('loc_1', { planId: 'plan' });
    expect(mockInstance.post).toHaveBeenCalledWith(
      '/saas-api/public-api/enable-saas/loc_1',
      { planId: 'plan' }
    );
  });

  it('GET marketplace charge by id', async () => {
    mockInstance.get.mockResolvedValueOnce({ data: { id: 'ch_1' } });
    await client.getMarketplaceCharge('ch_1');
    expect(mockInstance.get).toHaveBeenCalledWith('/marketplace/billing/charges/ch_1');
  });

  it('DELETE funnel redirect with locationId param', async () => {
    mockInstance.delete.mockResolvedValueOnce({ data: { success: true } });
    await client.deleteFunnelRedirect('redir_1', 'loc_2');
    expect(mockInstance.delete).toHaveBeenCalledWith(
      '/funnels/lookup/redirect/redir_1',
      expect.objectContaining({ params: expect.objectContaining({ locationId: 'loc_2' }) })
    );
  });

  it('POST forms upload with multipart header', async () => {
    mockInstance.post.mockResolvedValueOnce({ data: { ok: true } });
    await client.uploadFormCustomFiles('contact_1', 'loc_1');
    expect(mockInstance.post).toHaveBeenCalledWith(
      '/forms/upload-custom-files',
      {},
      expect.objectContaining({
        params: expect.objectContaining({ contactId: 'contact_1', locationId: 'loc_1' }),
        headers: expect.objectContaining({ 'Content-Type': 'multipart/form-data' })
      })
    );
  });

  it('GET proposals documents with filters', async () => {
    mockInstance.get.mockResolvedValueOnce({ data: { items: [] } });
    await client.listProposalDocuments({ locationId: 'loc_1', status: 'SENT', limit: 10 });
    expect(mockInstance.get).toHaveBeenCalledWith(
      '/proposals/document',
      expect.objectContaining({ params: expect.objectContaining({ locationId: 'loc_1', status: 'SENT', limit: 10 }) })
    );
  });

  describe('New Contact Endpoints - Contract Tests', () => {
    describe('removeContactFromAllCampaigns', () => {
      it('should send DELETE request with correct URL and headers', async () => {
        const contactId = 'contact_12345';
        const expectedResponse = { succeded: true };
        
        mockInstance.delete.mockResolvedValueOnce({ data: expectedResponse });
        
        const result = await client.removeContactFromAllCampaigns(contactId);
        
        expect(mockInstance.delete).toHaveBeenCalledWith(
          `/contacts/${contactId}/campaigns/removeAll`,
          {
            headers: {
              Version: '2021-07-28'
            }
          }
        );
        expect(result.success).toBe(true);
        expect(result.data.succeded).toBe(true);
      });

      it('should handle API errors properly', async () => {
        const contactId = 'invalid_contact';
        const errorResponse = {
          response: {
            status: 404,
            data: { message: 'Contact not found' }
          }
        };
        
        mockInstance.delete.mockRejectedValueOnce(errorResponse);
        
        const result = await client.removeContactFromAllCampaigns(contactId);
        
        expect(result.success).toBe(false);
        expect(result.error?.message).toBe('GHL API Error (404): Contact not found');
        expect(result.error?.statusCode).toBe(404);
      });
    });

    describe('updateContactTagsBulk', () => {
      it('should send POST request with correct URL, body and headers for adding tags', async () => {
        const contactIds = ['contact_1', 'contact_2', 'contact_3'];
        const tagIds = ['tag_a', 'tag_b'];
        const type = 'add';
        const expectedResponse = {
          succeeded: true,
          errorCount: 0,
          responses: [
            { contactId: 'contact_1', message: 'Success', type: 'success', tagsAdded: ['tag_a', 'tag_b'] }
          ]
        };
        
        mockInstance.post.mockResolvedValueOnce({ data: expectedResponse });
        
        const result = await client.updateContactTagsBulk(contactIds, tagIds, type);
        
        expect(mockInstance.post).toHaveBeenCalledWith(
          `/contacts/bulk/tags/update/${type}`,
          {
            ids: contactIds,
            tags: tagIds
          },
          {
            headers: {
              Version: '2021-07-28'
            }
          }
        );
        expect(result.success).toBe(true);
        expect(result.data.succeeded).toBe(true);
        expect(result.data.errorCount).toBe(0);
      });

      it('should send POST request for removing tags', async () => {
        const contactIds = ['contact_1'];
        const tagIds = ['tag_c'];
        const type = 'remove';
        const expectedResponse = {
          succeeded: true,
          errorCount: 0,
          responses: [
            { contactId: 'contact_1', message: 'Success', type: 'success', tagsRemoved: ['tag_c'] }
          ]
        };
        
        mockInstance.post.mockResolvedValueOnce({ data: expectedResponse });
        
        await client.updateContactTagsBulk(contactIds, tagIds, type);
        
        expect(mockInstance.post).toHaveBeenCalledWith(
          `/contacts/bulk/tags/update/${type}`,
          {
            ids: contactIds,
            tags: tagIds
          },
          {
            headers: {
              Version: '2021-07-28'
            }
          }
        );
      });

      it('should handle validation errors for invalid type parameter', async () => {
        const contactIds = ['contact_1'];
        const tagIds = ['tag_a'];
        const invalidType = 'invalid' as any;
        
        const errorResponse = {
          response: {
            status: 400,
            data: { message: 'Invalid type parameter. Must be "add" or "remove"' }
          }
        };
        
        mockInstance.post.mockRejectedValueOnce(errorResponse);
        
        const result = await client.updateContactTagsBulk(contactIds, tagIds, invalidType);
        
        expect(result.success).toBe(false);
        expect(result.error?.message).toBe('GHL API Error (400): Invalid type parameter. Must be "add" or "remove"');
        expect(result.error?.statusCode).toBe(400);
      });
    });

    describe('updateContactBusinessBulk', () => {
      it('should send POST request with business ID assignment', async () => {
        const contactIds = ['contact_1', 'contact_2'];
        const businessId = 'business_123';
        const expectedResponse = {
          success: true,
          ids: contactIds
        };
        
        mockInstance.post.mockResolvedValueOnce({ data: expectedResponse });
        
        const result = await client.updateContactBusinessBulk(contactIds, businessId);
        
        expect(mockInstance.post).toHaveBeenCalledWith(
          '/contacts/bulk/business',
          {
            ids: contactIds,
            businessId: businessId
          },
          {
            headers: {
              Version: '2021-07-28'
            }
          }
        );
        expect(result.success).toBe(true);
        expect(result.data.success).toBe(true);
        expect(result.data.ids).toEqual(contactIds);
      });

      it('should send POST request with null business ID to remove association', async () => {
        const contactIds = ['contact_1'];
        const businessId = null;
        const expectedResponse = {
          success: true,
          ids: contactIds
        };
        
        mockInstance.post.mockResolvedValueOnce({ data: expectedResponse });
        
        await client.updateContactBusinessBulk(contactIds, businessId);
        
        expect(mockInstance.post).toHaveBeenCalledWith(
          '/contacts/bulk/business',
          {
            ids: contactIds,
            businessId: null
          },
          {
            headers: {
              Version: '2021-07-28'
            }
          }
        );
      });

      it('should handle empty contact IDs array', async () => {
        const contactIds: string[] = [];
        const businessId = 'business_123';
        
        const errorResponse = {
          response: {
            status: 400,
            data: { message: 'Contact IDs array cannot be empty' }
          }
        };
        
        mockInstance.post.mockRejectedValueOnce(errorResponse);
        
        const result = await client.updateContactBusinessBulk(contactIds, businessId);
        
        expect(result.success).toBe(false);
        expect(result.error?.message).toBe('GHL API Error (400): Contact IDs array cannot be empty');
        expect(result.error?.statusCode).toBe(400);
      });
    });

    describe('getContacts', () => {
      it('should send GET request with correct parameters and headers', async () => {
        const params = {
          locationId: 'location_456',
          startAfterId: 'contact_start_123',
          limit: 50,
          query: 'john@example.com'
        };
        const expectedResponse = {
          contacts: [
            { id: 'contact_1', firstName: 'John', email: 'john@example.com' },
            { id: 'contact_2', firstName: 'Jane', email: 'jane@example.com' }
          ],
          count: 2,
          totalCount: 100,
          meta: {
            startAfterId: 'contact_start_123'
          }
        };
        
        mockInstance.get.mockResolvedValueOnce({ data: expectedResponse });
        
        const result = await client.getContacts(params);
        
        expect(mockInstance.get).toHaveBeenCalledWith(
          '/contacts',
          {
            params: {
              locationId: params.locationId,
              startAfterId: params.startAfterId,
              limit: params.limit,
              query: params.query
            },
            headers: {
              Version: '2021-07-28'
            }
          }
        );
        expect(result.success).toBe(true);
        expect(result.data.contacts).toHaveLength(2);
        expect(result.data.count).toBe(2);
        expect(result.data.totalCount).toBe(100);
      });

      it('should send GET request with minimal required parameters', async () => {
        const params = {
          locationId: 'location_789'
        };
        const expectedResponse = {
          contacts: [],
          count: 0,
          totalCount: 0
        };
        
        mockInstance.get.mockResolvedValueOnce({ data: expectedResponse });
        
        await client.getContacts(params);
        
        expect(mockInstance.get).toHaveBeenCalledWith(
          '/contacts',
          {
            params: {
              locationId: params.locationId,
              limit: 100 // Default limit
            },
            headers: {
              Version: '2021-07-28'
            }
          }
        );
      });

      it('should handle missing locationId parameter', async () => {
        const params = {
          startAfterId: 'contact_123',
          limit: 25
        } as any; // Missing required locationId
        
        const errorResponse = {
          response: {
            status: 400,
            data: { message: 'locationId is required' }
          }
        };
        
        mockInstance.get.mockRejectedValueOnce(errorResponse);
        
        const result = await client.getContacts(params);
        
        expect(result.success).toBe(false);
        expect(result.error?.message).toBe('GHL API Error (400): locationId is required');
        expect(result.error?.statusCode).toBe(400);
      });
    });
  });

  describe('Parameter Naming Validation Tests', () => {
    it('should use exact parameter names without params prefix in URL construction', async () => {
      mockInstance.get.mockResolvedValueOnce({ data: { contacts: [] } });
      
      await client.getContacts({ 
        locationId: 'loc_123', 
        startAfterId: 'contact_456', 
        limit: 25,
        query: 'test@example.com'
      });
      
      // Verify that the parameters are passed correctly without 'params.' prefix
      const callArgs = mockInstance.get.mock.calls[0];
      const requestConfig = callArgs[1];
      
      expect(requestConfig.params).toEqual({
        locationId: 'loc_123',
        startAfterId: 'contact_456', 
        limit: 25,
        query: 'test@example.com'
      });
      
      // Verify no 'params.' prefix in parameter names
      const paramNames = Object.keys(requestConfig.params);
      paramNames.forEach(paramName => {
        expect(paramName).not.toMatch(/^params\./); 
      });
    });

    it('should construct URLs with path parameters correctly', async () => {
      const contactId = 'contact_789';
      mockInstance.delete.mockResolvedValueOnce({ data: { succeded: true } });
      
      await client.removeContactFromAllCampaigns(contactId);
      
      const callArgs = mockInstance.delete.mock.calls[0];
      const url = callArgs[0];
      
      // Verify URL construction matches vendor specs exactly
      expect(url).toBe(`/contacts/${contactId}/campaigns/removeAll`);
      expect(url).not.toMatch(/params\./); // No params prefix in URL
    });

    it('should handle bulk endpoints with correct type parameter in URL path', async () => {
      const contactIds = ['c1', 'c2'];
      const tagIds = ['t1', 't2'];
      const type = 'add';
      
      mockInstance.post.mockResolvedValueOnce({ data: { succeeded: true } });
      
      await client.updateContactTagsBulk(contactIds, tagIds, type);
      
      const callArgs = mockInstance.post.mock.calls[0];
      const url = callArgs[0];
      
      // Verify type parameter is correctly included in URL path
      expect(url).toBe(`/contacts/bulk/tags/update/${type}`);
      expect(url).toMatch(/\/add$/);
    });
  });

  describe('Version Header Requirements', () => {
    it('should use Version 2021-07-28 for Contact endpoints', async () => {
      const testCases = [
        () => client.removeContactFromAllCampaigns('contact_123'),
        () => client.updateContactTagsBulk(['contact_1'], ['tag_1'], 'add'),
        () => client.updateContactBusinessBulk(['contact_1'], 'business_1'),
        () => client.getContacts({ locationId: 'loc_123' })
      ];
      
      // Mock all responses
      mockInstance.delete.mockResolvedValue({ data: { succeded: true } });
      mockInstance.post.mockResolvedValue({ data: { success: true } });
      mockInstance.get.mockResolvedValue({ data: { contacts: [] } });
      
      for (const testCall of testCases) {
        await testCall();
      }
      
      // Verify all calls used the correct Contact API version
      const allCalls = [
        ...mockInstance.delete.mock.calls,
        ...mockInstance.post.mock.calls,
        ...mockInstance.get.mock.calls
      ];
      
      allCalls.forEach((call, index) => {
        const config = call[1] || call[2]; // Different position for different HTTP methods
        if (config && config.headers) {
          expect(config.headers.Version).toBe('2021-07-28');
        }
      });
    });

    it('should use Version 2021-04-15 for Voice AI endpoints', async () => {
      mockInstance.get.mockResolvedValue({ data: { ok: true } });
      
      await client.listVoiceAICallLogs({ locationId: 'loc_123' });
      
      expect(mockInstance.get).toHaveBeenCalledWith(
        '/voice-ai/dashboard/call-logs',
        expect.objectContaining({
          params: expect.objectContaining({ locationId: 'loc_123' }),
          headers: expect.objectContaining({ Version: '2021-04-15' })
        })
      );
    });

    it('should not mix version headers between endpoint types', async () => {
      // Mock responses for both endpoint types
      mockInstance.get.mockResolvedValueOnce({ data: { contacts: [] } });
      mockInstance.get.mockResolvedValueOnce({ data: { callLogs: [] } });
      
      // Call Contact API endpoint
      await client.getContacts({ locationId: 'loc_123' });
      
      // Call Voice AI endpoint  
      await client.listVoiceAICallLogs({ locationId: 'loc_123' });
      
      const calls = mockInstance.get.mock.calls;
      
      // First call (Contact API) should use 2021-07-28
      expect(calls[0][1].headers.Version).toBe('2021-07-28');
      
      // Second call (Voice AI) should use 2021-04-15
      expect(calls[1][1].headers.Version).toBe('2021-04-15');
    });
  });
});

