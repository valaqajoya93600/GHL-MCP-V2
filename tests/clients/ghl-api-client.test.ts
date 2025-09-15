/**
 * Unit Tests for GHL API Client
 * Tests API client configuration, connection, and error handling
 */

import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';

// Mock axios
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

const mockAxios = {
  create: jest.fn(() => mockAxiosInstance)
};

jest.mock('axios', () => ({
  __esModule: true,
  default: mockAxios,
  ...mockAxios
}));

import { GHLApiClient } from '../../src/clients/ghl-api-client.js';

describe('GHLApiClient', () => {
  let ghlClient: GHLApiClient;

  beforeEach(() => {
    // Reset environment variables
    process.env.GHL_API_KEY = 'test_api_key_123';
    process.env.GHL_BASE_URL = 'https://test.leadconnectorhq.com';
    process.env.GHL_LOCATION_ID = 'test_location_123';

    // Reset mocks
    jest.clearAllMocks();

    ghlClient = new GHLApiClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with environment variables', () => {
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://test.leadconnectorhq.com',
        headers: {
          'Authorization': 'Bearer test_api_key_123',
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      });
    });

    it('should throw error if API key is missing', () => {
      delete process.env.GHL_API_KEY;
      
      expect(() => {
        new GHLApiClient();
      }).toThrow('GHL_API_KEY environment variable is required');
    });

    it('should throw error if base URL is missing', () => {
      delete process.env.GHL_BASE_URL;
      
      expect(() => {
        new GHLApiClient();
      }).toThrow('GHL_BASE_URL environment variable is required');
    });

    it('should throw error if location ID is missing', () => {
      delete process.env.GHL_LOCATION_ID;
      
      expect(() => {
        new GHLApiClient();
      }).toThrow('GHL_LOCATION_ID environment variable is required');
    });

    it('should use custom configuration when provided', () => {
      const customConfig = {
        accessToken: 'custom_token',
        baseUrl: 'https://custom.ghl.com',
        locationId: 'custom_location',
        version: '2022-01-01'
      };

      new GHLApiClient(customConfig);

      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://custom.ghl.com',
        headers: {
          'Authorization': 'Bearer custom_token',
          'Version': '2022-01-01',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      });
    });
  });

  describe('getConfig', () => {
    it('should return current configuration', () => {
      const config = ghlClient.getConfig();
      
      expect(config).toEqual({
        accessToken: 'test_api_key_123',
        baseUrl: 'https://test.leadconnectorhq.com',
        locationId: 'test_location_123',
        version: '2021-07-28'
      });
    });
  });

  describe('updateAccessToken', () => {
    it('should update access token and recreate axios instance', () => {
      ghlClient.updateAccessToken('new_token_456');

      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://test.leadconnectorhq.com',
        headers: {
          'Authorization': 'Bearer new_token_456',
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      const config = ghlClient.getConfig();
      expect(config.accessToken).toBe('new_token_456');
    });
  });

  describe('testConnection', () => {
    it('should test connection successfully', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { success: true },
        status: 200
      });

      const result = await ghlClient.testConnection();

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        status: 'connected',
        locationId: 'test_location_123'
      });
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/locations/test_location_123');
    });

    it('should handle connection failure', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(ghlClient.testConnection()).rejects.toThrow('GHL API connection test failed: Error: Network error');
    });
  });

  describe('Contact API methods', () => {
    describe('createContact', () => {
      it('should create contact successfully', async () => {
        const contactData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        };

        mockAxiosInstance.post.mockResolvedValueOnce({
          data: { contact: { id: 'contact_123', ...contactData } }
        });

        const result = await ghlClient.createContact(contactData);

        expect(result.success).toBe(true);
        expect(result.data.id).toBe('contact_123');
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/contacts/', {
          ...contactData,
          locationId: 'test_location_123'
        });
      });

      it('should handle create contact error', async () => {
        mockAxiosInstance.post.mockRejectedValueOnce({
          response: { status: 400, data: { message: 'Invalid email' } }
        });

        const result = await ghlClient.createContact({ email: 'invalid' });
        expect(result.success).toBe(false);
        expect(result.error?.message).toBe('GHL API Error (400): Invalid email');
      });
    });

    describe('getContact', () => {
      it('should get contact successfully', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({
          data: { contact: { id: 'contact_123', name: 'John Doe' } }
        });

        const result = await ghlClient.getContact('contact_123');

        expect(result.success).toBe(true);
        expect(result.data.id).toBe('contact_123');
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/contacts/contact_123');
      });
    });

    describe('searchContacts', () => {
      it('should search contacts successfully', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce({
          data: { 
            contacts: [{ id: 'contact_123' }],
            total: 1
          }
        });

        const result = await ghlClient.searchContacts({ query: 'John' });

        expect(result.success).toBe(true);
        expect(result.data.contacts).toHaveLength(1);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/contacts/search', {
          locationId: 'test_location_123',
          pageLimit: 25,
          query: 'John'
        });
      });
    });
  });

  describe('Conversation API methods', () => {
    describe('sendSMS', () => {
      it('should send SMS successfully', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce({
          data: { messageId: 'msg_123', conversationId: 'conv_123' }
        });

        const result = await ghlClient.sendSMS('contact_123', 'Hello World');

        expect(result.success).toBe(true);
        expect(result.data.messageId).toBe('msg_123');
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/conversations/messages', {
          type: 'SMS',
          contactId: 'contact_123',
          message: 'Hello World',
          fromNumber: undefined
        }, {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer test_api_key_123',
            'Content-Type': 'application/json',
            'Version': '2021-04-15'
          }
        });
      });

      it('should send SMS with custom from number', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce({
          data: { messageId: 'msg_123' }
        });

        await ghlClient.sendSMS('contact_123', 'Hello', '+1-555-000-0000');

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/conversations/messages', {
          type: 'SMS',
          contactId: 'contact_123',
          message: 'Hello',
          fromNumber: '+1-555-000-0000'
        }, {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer test_api_key_123',
            'Content-Type': 'application/json',
            'Version': '2021-04-15'
          }
        });
      });
    });

    describe('sendEmail', () => {
      it('should send email successfully', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce({
          data: { emailMessageId: 'email_123' }
        });

        const result = await ghlClient.sendEmail('contact_123', 'Test Subject', 'Test body');

        expect(result.success).toBe(true);
        expect(result.data.emailMessageId).toBe('email_123');
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/conversations/messages', {
          type: 'Email',
          contactId: 'contact_123',
          subject: 'Test Subject',
          message: 'Test body'
        }, {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer test_api_key_123',
            'Content-Type': 'application/json',
            'Version': '2021-04-15'
          }
        });
      });

      it('should send email with HTML and options', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce({
          data: { emailMessageId: 'email_123' }
        });

        const options = { emailCc: ['cc@example.com'] };
        await ghlClient.sendEmail('contact_123', 'Subject', 'Text', '<h1>HTML</h1>', options);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/conversations/messages', {
          type: 'Email',
          contactId: 'contact_123',
          subject: 'Subject',
          message: 'Text',
          html: '<h1>HTML</h1>',
          emailCc: ['cc@example.com']
        }, {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer test_api_key_123',
            'Content-Type': 'application/json',
            'Version': '2021-04-15'
          }
        });
      });
    });
  });

  describe('Blog API methods', () => {
    describe('createBlogPost', () => {
      it('should create blog post successfully', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce({
          data: { data: { _id: 'post_123', title: 'Test Post' } }
        });

        const postData = {
          title: 'Test Post',
          blogId: 'blog_123',
          rawHTML: '<h1>Content</h1>'
        };

        const result = await ghlClient.createBlogPost(postData);

        expect(result.success).toBe(true);
        expect(result.data.data._id).toBe('post_123');
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/blogs/posts', {
          ...postData,
          locationId: 'test_location_123'
        });
      });
    });

    describe('getBlogSites', () => {
      it('should get blog sites successfully', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({
          data: { data: [{ _id: 'blog_123', name: 'Test Blog' }] }
        });

        const result = await ghlClient.getBlogSites({ locationId: 'loc_123' });

        expect(result.success).toBe(true);
        expect(result.data.data).toHaveLength(1);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/blogs/site/all', {
          params: {
            locationId: 'loc_123',
            limit: undefined,
            skip: undefined
          }
        });
      });
    });
  });

  describe('Error handling', () => {
    it('should format axios error with response', async () => {
      const axiosError = {
        message: 'Request failed with status code 404',
        response: {
          status: 404,
          data: { message: 'Contact not found' }
        }
      };

      mockAxiosInstance.get.mockRejectedValueOnce(axiosError);

      const result = await ghlClient.getContact('not_found');
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('GHL API Error (404): Contact not found');
    });

    it('should format axios error without response data', async () => {
      const axiosError = {
        message: 'Request failed with status code 500',
        response: {
          status: 500,
          statusText: 'Internal Server Error'
        }
      };

      mockAxiosInstance.get.mockRejectedValueOnce(axiosError);

      const result = await ghlClient.getContact('contact_123');
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('GHL API Error (500): Request failed with status code 500');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValueOnce(networkError);

      const result = await ghlClient.getContact('contact_123');
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('GHL API Error (500): Network Error');
    });
  });

  describe('New Contact API Endpoints - Integration Tests', () => {
    describe('removeContactFromAllCampaigns', () => {
      it('should remove contact from all campaigns successfully', async () => {
        const contactId = 'contact_test_123';
        const expectedResponse = { succeded: true };

        mockAxiosInstance.delete.mockResolvedValueOnce({
          data: expectedResponse,
          status: 200
        });

        const result = await ghlClient.removeContactFromAllCampaigns(contactId);

        expect(result.success).toBe(true);
        expect(result.data.succeded).toBe(true);
        expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
          `/contacts/${contactId}/campaigns/removeAll`,
          {
            headers: {
              Version: '2021-07-28'
            }
          }
        );
      });

      it('should handle 404 error when contact not found', async () => {
        const contactId = 'nonexistent_contact';
        const errorResponse = {
          response: {
            status: 404,
            data: { message: 'Contact not found or already removed from campaigns' }
          }
        };

        mockAxiosInstance.delete.mockRejectedValueOnce(errorResponse);

        const result = await ghlClient.removeContactFromAllCampaigns(contactId);
        expect(result.success).toBe(false);
        expect(result.error?.message).toBe('GHL API Error (404): Contact not found or already removed from campaigns');
      });
    });

    describe('updateContactTagsBulk', () => {
      it('should add tags to multiple contacts successfully', async () => {
        const contactIds = ['contact_1', 'contact_2', 'contact_3'];
        const tagIds = ['tag_marketing', 'tag_vip'];
        const type = 'add';
        const expectedResponse = {
          succeeded: true,
          errorCount: 0,
          responses: [
            { contactId: 'contact_1', message: 'Tags added successfully', type: 'success', tagsAdded: tagIds },
            { contactId: 'contact_2', message: 'Tags added successfully', type: 'success', tagsAdded: tagIds },
            { contactId: 'contact_3', message: 'Tags added successfully', type: 'success', tagsAdded: tagIds }
          ]
        };

        mockAxiosInstance.post.mockResolvedValueOnce({
          data: expectedResponse,
          status: 200
        });

        const result = await ghlClient.updateContactTagsBulk(contactIds, tagIds, type);

        expect(result.success).toBe(true);
        expect(result.data.succeeded).toBe(true);
        expect(result.data.errorCount).toBe(0);
        expect(result.data.responses).toHaveLength(3);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
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

      it('should remove tags from contacts successfully', async () => {
        const contactIds = ['contact_1'];
        const tagIds = ['tag_old', 'tag_outdated'];
        const type = 'remove';
        const expectedResponse = {
          succeeded: true,
          errorCount: 0,
          responses: [
            { contactId: 'contact_1', message: 'Tags removed successfully', type: 'success', tagsRemoved: tagIds }
          ]
        };

        mockAxiosInstance.post.mockResolvedValueOnce({
          data: expectedResponse,
          status: 200
        });

        const result = await ghlClient.updateContactTagsBulk(contactIds, tagIds, type);

        expect(result.success).toBe(true);
        expect(result.data.responses[0].tagsRemoved).toEqual(tagIds);
      });

      it('should handle partial failures in bulk operation', async () => {
        const contactIds = ['contact_valid', 'contact_invalid'];
        const tagIds = ['tag_test'];
        const type = 'add';
        const expectedResponse = {
          succeeded: false,
          errorCount: 1,
          responses: [
            { contactId: 'contact_valid', message: 'Tags added successfully', type: 'success', tagsAdded: tagIds },
            { contactId: 'contact_invalid', message: 'Contact not found', type: 'error' }
          ]
        };

        mockAxiosInstance.post.mockResolvedValueOnce({
          data: expectedResponse,
          status: 200
        });

        const result = await ghlClient.updateContactTagsBulk(contactIds, tagIds, type);

        expect(result.success).toBe(true); // API call succeeded
        expect(result.data.succeeded).toBe(false); // But operation had failures
        expect(result.data.errorCount).toBe(1);
        expect(result.data.responses).toHaveLength(2);
      });
    });

    describe('updateContactBusinessBulk', () => {
      it('should associate contacts with business successfully', async () => {
        const contactIds = ['contact_1', 'contact_2'];
        const businessId = 'business_abc123';
        const expectedResponse = {
          success: true,
          ids: contactIds
        };

        mockAxiosInstance.post.mockResolvedValueOnce({
          data: expectedResponse,
          status: 200
        });

        const result = await ghlClient.updateContactBusinessBulk(contactIds, businessId);

        expect(result.success).toBe(true);
        expect(result.data.success).toBe(true);
        expect(result.data.ids).toEqual(contactIds);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
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
      });

      it('should remove business association by passing null', async () => {
        const contactIds = ['contact_1'];
        const businessId = null;
        const expectedResponse = {
          success: true,
          ids: contactIds
        };

        mockAxiosInstance.post.mockResolvedValueOnce({
          data: expectedResponse,
          status: 200
        });

        const result = await ghlClient.updateContactBusinessBulk(contactIds, businessId);

        expect(result.success).toBe(true);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
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
    });

    describe('getContacts (deprecated endpoint)', () => {
      it('should retrieve contacts with pagination', async () => {
        const params = {
          locationId: 'loc_test_456',
          startAfterId: 'contact_start_789',
          limit: 50,
          query: 'john'
        };
        const expectedResponse = {
          contacts: [
            { id: 'contact_1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
            { id: 'contact_2', firstName: 'Johnny', lastName: 'Smith', email: 'johnny.smith@example.com' }
          ],
          count: 2,
          totalCount: 150,
          meta: {
            startAfterId: params.startAfterId,
            startAfter: 'contact_start_789'
          }
        };

        mockAxiosInstance.get.mockResolvedValueOnce({
          data: expectedResponse,
          status: 200
        });

        const result = await ghlClient.getContacts(params);

        expect(result.success).toBe(true);
        expect(result.data.contacts).toHaveLength(2);
        expect(result.data.count).toBe(2);
        expect(result.data.totalCount).toBe(150);
        expect(result.data.meta.startAfterId).toBe(params.startAfterId);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
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
      });

      it('should use default limit when not specified', async () => {
        const params = { locationId: 'loc_default' };
        const expectedResponse = {
          contacts: [],
          count: 0,
          totalCount: 0
        };

        mockAxiosInstance.get.mockResolvedValueOnce({
          data: expectedResponse,
          status: 200
        });

        await ghlClient.getContacts(params);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
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
    });
  });

  describe('Regression Tests - Existing Functionality', () => {
    it('should maintain backward compatibility for existing contact methods', async () => {
      // Test that existing methods still work as expected
      const contactData = {
        firstName: 'Regression',
        lastName: 'Test',
        email: 'regression@test.com'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { contact: { id: 'regression_123', ...contactData } }
      });

      const result = await ghlClient.createContact(contactData);

      expect(result.success).toBe(true);
      expect(result.data.firstName).toBe('Regression');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/contacts/', {
        ...contactData,
        locationId: 'test_location_123'
      });
    });

    it('should maintain proper error handling across all endpoints', async () => {
      const errorScenarios = [
        { method: () => ghlClient.getContact('invalid'), expectedError: /GHL API Error/ },
        { method: () => ghlClient.createContact({ email: 'invalid' }), expectedError: /GHL API Error/ },
        { method: () => ghlClient.removeContactFromAllCampaigns('invalid'), expectedError: /GHL API Error/ }
      ];

      for (const scenario of errorScenarios) {
        const errorResponse = {
          message: 'Request failed with status code 400',
          response: {
            status: 400,
            data: { message: 'Test error' }
          }
        };

        mockAxiosInstance.get.mockRejectedValueOnce(errorResponse);
        mockAxiosInstance.post.mockRejectedValueOnce(errorResponse);
        mockAxiosInstance.delete.mockRejectedValueOnce(errorResponse);

        const result = await scenario.method();
        expect(result.success).toBe(false);
        expect(result.error?.message).toMatch(scenario.expectedError);
      }
    });

    it('should preserve response wrapper format across all endpoints', async () => {
      // Reset all mocks completely
      mockAxiosInstance.get.mockReset();
      mockAxiosInstance.post.mockReset();
      mockAxiosInstance.delete.mockReset();
      mockAxiosInstance.put.mockReset();
      mockAxiosInstance.patch.mockReset();

      // Set up individual mocks for each method with successful responses
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { contact: { id: 'test' } }, status: 200 });
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: { succeded: true }, status: 200 });
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { succeeded: true }, status: 200 });

      // Test each method individually
      const contactResult = await ghlClient.getContact('test');
      expect(contactResult).toHaveProperty('success', true);
      expect(contactResult).toHaveProperty('data');
      expect(typeof contactResult.success).toBe('boolean');

      const campaignResult = await ghlClient.removeContactFromAllCampaigns('test');
      expect(campaignResult).toHaveProperty('success', true);
      expect(campaignResult).toHaveProperty('data');
      expect(typeof campaignResult.success).toBe('boolean');

      const tagsResult = await ghlClient.updateContactTagsBulk(['test'], ['tag'], 'add');
      expect(tagsResult).toHaveProperty('success', true);
      expect(tagsResult).toHaveProperty('data');
      expect(typeof tagsResult.success).toBe('boolean');
    });

    it('should maintain consistent header usage across similar endpoints', async () => {
      // Test that similar endpoints use consistent headers
      const contactMethods = [
        () => ghlClient.removeContactFromAllCampaigns('test'),
        () => ghlClient.updateContactTagsBulk(['test'], ['tag'], 'add'),
        () => ghlClient.updateContactBusinessBulk(['test'], 'business'),
        () => ghlClient.getContacts({ locationId: 'test' })
      ];

      // Mock all responses
      mockAxiosInstance.delete.mockResolvedValue({ data: { succeded: true } });
      mockAxiosInstance.post.mockResolvedValue({ data: { success: true } });
      mockAxiosInstance.get.mockResolvedValue({ data: { contacts: [] } });

      for (const method of contactMethods) {
        await method();
      }

      // Verify all Contact API calls use the same version header
      const allCalls = [
        ...mockAxiosInstance.delete.mock.calls,
        ...mockAxiosInstance.post.mock.calls,
        ...mockAxiosInstance.get.mock.calls
      ];

      allCalls.forEach(call => {
        const config = call[1] || call[2];
        if (config && config.headers && config.headers.Version) {
          expect(config.headers.Version).toBe('2021-07-28');
        }
      });
    });
  });

  describe('TypeScript Type Safety Validation', () => {
    it('should enforce correct parameter types for new endpoints', () => {
      // These should compile without TypeScript errors
      expect(() => {
        // Valid calls - should not throw compilation errors
        const validCalls = [
          ghlClient.removeContactFromAllCampaigns('string_id'),
          ghlClient.updateContactTagsBulk(['contact1'], ['tag1'], 'add'),
          ghlClient.updateContactTagsBulk(['contact1'], ['tag1'], 'remove'),
          ghlClient.updateContactBusinessBulk(['contact1'], 'business_id'),
          ghlClient.updateContactBusinessBulk(['contact1'], null),
          ghlClient.getContacts({ locationId: 'loc_123' }),
          ghlClient.getContacts({ locationId: 'loc_123', limit: 50, query: 'test' })
        ];
      }).not.toThrow();
    });

    it('should return properly typed responses', async () => {
      // Test response type compliance
      const tagResponse = {
        succeeded: true,
        errorCount: 0,
        responses: [
          { contactId: 'test', message: 'Success', type: 'success' as const, tagsAdded: ['tag1'] }
        ]
      };

      mockAxiosInstance.post.mockResolvedValueOnce({ data: tagResponse });

      const result = await ghlClient.updateContactTagsBulk(['test'], ['tag1'], 'add');

      // TypeScript should infer these properties exist
      expect(result.data.succeeded).toBe(true);
      expect(result.data.errorCount).toBe(0);
      expect(result.data.responses[0].contactId).toBe('test');
      expect(result.data.responses[0].type).toBe('success');
    });
  });

  describe('Request/Response handling', () => {
    it('should properly format successful responses', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { contact: { id: 'contact_123' } },
        status: 200
      });

      const result = await ghlClient.getContact('contact_123');

      expect(result).toEqual({
        success: true,
        data: { id: 'contact_123' }
      });
    });

    it('should extract nested data correctly', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { 
          data: { 
            blogPost: { _id: 'post_123', title: 'Test' }
          }
        }
      });

      const result = await ghlClient.createBlogPost({
        title: 'Test',
        blogId: 'blog_123'
      });

      expect(result.data).toEqual({
        data: {
          blogPost: { _id: 'post_123', title: 'Test' }
        }
      });
    });
  });
}); 