/**
 * GoHighLevel Contact Tools - PRODUCTION READY VERSION
 * Implements all contact management functionality for the MCP server
 * 
 * CHANGELOG:
 * - Fixed search_contacts to use query parameter for email/phone searches
 * - Fixed get_contact with proper contactId validation
 * - Enhanced search_contacts response with contactId on top level
 * - Added comprehensive error handling and logging
 * - Preserved get_contact tool with proper workflow
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';
import {
  MCPCreateContactParams,
  MCPSearchContactsParams,
  MCPUpdateContactParams,
  MCPAddContactTagsParams,
  MCPRemoveContactTagsParams,
  // Task Management
  MCPGetContactTasksParams,
  MCPCreateContactTaskParams,
  MCPGetContactTaskParams,
  MCPUpdateContactTaskParams,
  MCPDeleteContactTaskParams,
  MCPUpdateTaskCompletionParams,
  // Note Management
  MCPGetContactNotesParams,
  MCPCreateContactNoteParams,
  MCPGetContactNoteParams,
  MCPUpdateContactNoteParams,
  MCPDeleteContactNoteParams,
  // Advanced Operations
  MCPUpsertContactParams,
  MCPGetDuplicateContactParams,
  MCPGetContactsByBusinessParams,
  MCPGetContactAppointmentsParams,
  // Bulk Operations
  MCPBulkUpdateContactTagsParams,
  MCPBulkUpdateContactBusinessParams,
  // Followers Management
  MCPAddContactFollowersParams,
  MCPRemoveContactFollowersParams,
  // Campaign Management
  MCPAddContactToCampaignParams,
  MCPRemoveContactFromCampaignParams,
  MCPRemoveContactFromAllCampaignsParams,
  // Workflow Management
  MCPAddContactToWorkflowParams,
  MCPRemoveContactFromWorkflowParams,
  GHLContact,
  GHLSearchContactsResponse,
  GHLContactTagsResponse,
  GHLTask,
  GHLNote,
  GHLAppointment,
  GHLUpsertContactResponse,
  GHLBulkTagsResponse,
  GHLBulkBusinessResponse,
  GHLFollowersResponse
} from '../types/ghl-types.js';

/**
 * Contact Tools class
 * Provides comprehensive contact management capabilities
 */
export class ContactTools {
  constructor(private ghlClient: GHLApiClient) {}

  /**
   * Get tool definitions for all contact operations
   */
  getToolDefinitions(): Tool[] {
    return [
      // Basic Contact Management
      {
        name: 'create_contact',
        description: 'Create a new contact in GoHighLevel CRM. CRITICAL: Always use search_contacts with email parameter FIRST to check for duplicates before creating. If contact exists, use update_contact instead. For uncertain cases, use upsert_contact which automatically handles both create and update. Returns contactId (save this for future operations). LocationId is auto-handled by server.',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Contact primary email address (REQUIRED). Must be unique per location. Used as primary identifier for duplicate detection. Format: user@domain.com (lowercase recommended). Example: "john.doe@example.com". Will be used for all email communications.'
            },
            firstName: {
              type: 'string',
              description: 'Contact first name. Used for personalization in emails and SMS. Should be properly capitalized. Optional but highly recommended for personalized communication. Min 1, max 50 characters. Example: "John"'
            },
            lastName: {
              type: 'string',
              description: 'Contact last name. Combined with firstName for full name display in CRM. Should be properly capitalized. Optional. Min 1, max 50 characters. Example: "Doe"'
            },
            phone: {
              type: 'string',
              description: 'Contact phone number. Accepts any format but E.164 international format recommended for SMS delivery (+14155552671). Used for SMS communications and calls. Optional. Example: "+380501234567" or "0501234567"'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Tags for contact segmentation and filtering. Use existing location tags when possible. Tags are case-insensitive. Optional. Max 20 tags, each max 50 characters. Examples: ["VIP", "Newsletter", "Enterprise", "Webinar Attendee"]'
            },
            source: {
              type: 'string',
              description: 'Source of contact acquisition. Used for tracking lead sources and attribution. Optional. Defaults to "ChatGPT MCP". Max 100 characters. Examples: "Website Form", "Facebook Ad", "Referral", "Manual Entry", "LinkedIn Campaign"'
            }
          },
          required: ['email']
        }
      },
      {
        name: 'search_contacts',
        description: 'Search for contacts in GoHighLevel using email, phone, or name query. Returns array of matching contacts with contactId on top level for easy access. CRITICAL USAGE: Call this BEFORE create_contact to check for duplicates. Returns contactId field that can be used directly in other tools like get_contact, update_contact, add_contact_tags. IMPORTANT: Provide at least ONE search parameter (query, email, or phone). Email search is most reliable for exact matches. LocationId is auto-handled.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search by contact name, email, or phone. Performs fuzzy search across all text fields (firstName, lastName, email, phone, company). Case-insensitive. Min 2 characters for performance. Optional. Examples: "John Doe", "john@example.com", "0501234567", "Acme Corp"'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Search by exact email address match. MOST RELIABLE method for duplicate detection. Case-insensitive. Returns 0 or 1 result. Format: user@domain.com. Optional. Example: "john.doe@example.com"'
            },
            phone: {
              type: 'string',
              description: 'Search by phone number. Searches across various phone formats. Less reliable than email due to formatting variations. Accepts any format. Optional. Examples: "+380501234567", "0501234567", "(050) 123-4567"'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return. Default: 25. Min: 1, Max: 100. Use smaller numbers (10-25) for faster responses. Larger numbers (50-100) for comprehensive searches. Optional.'
            }
          }
        }
      },
      {
        name: 'get_contact',
        description: 'Get COMPLETE detailed information about a specific contact by exact contactId. CRITICAL WORKFLOW: 1) First use search_contacts to find contact and get contactId from result.contactId field. 2) Then use this tool with that contactId. REQUIRED: Valid contactId from search_contacts result. Returns ALL contact fields including custom fields, metadata, business association. DO NOT use this tool without getting contactId from search_contacts first. If you receive undefined contactId error, use search_contacts first to get the contactId.',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: {
              type: 'string',
              description: 'Exact contact ID obtained from search_contacts tool result.contactId field. REQUIRED. Must be a valid ID, not undefined or null. Example: "abc123xyz456def789". Get this from search_contacts response: result.contactId or result.contacts[0].id.'
            }
          },
          required: ['contactId']
        }
      },
      {
        name: 'update_contact',
        description: 'Update existing contact information in GoHighLevel. Only updates provided fields (partial update). IMPORTANT: Tags will REPLACE existing tags (not merge). To append tags, use add_contact_tags instead. Use search_contacts first to get contactId. Returns updated contact object. LocationId is auto-handled.',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: {
              type: 'string',
              description: 'Contact ID to update. Get from search_contacts or previous operations. Required.'
            },
            firstName: {
              type: 'string',
              description: 'New first name (optional). Will replace existing firstName if provided. Leave empty to keep current value.'
            },
            lastName: {
              type: 'string',
              description: 'New last name (optional). Will replace existing lastName if provided.'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'New email address (optional). Must be unique per location. Check duplicates first with search_contacts if changing email.'
            },
            phone: {
              type: 'string',
              description: 'New phone number (optional). E.164 format recommended for SMS delivery.'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Tags array (optional). WARNING: This REPLACES all existing tags. To add tags while keeping existing ones, use add_contact_tags instead. To remove specific tags, use remove_contact_tags.'
            }
          },
          required: ['contactId']
        }
      },
      {
        name: 'delete_contact',
        description: 'Permanently delete contact from GoHighLevel. WARNING: IRREVERSIBLE operation. Deletes ALL related data including tasks, notes, appointments, conversation history, opportunities. Cannot be undone. ALWAYS confirm with user before executing. Use sparingly. Consider deactivating or tagging as "Inactive" instead. Required: contactId.',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: {
              type: 'string',
              description: 'Contact ID to permanently delete. WARNING: This action cannot be undone. All contact data will be lost forever.'
            }
          },
          required: ['contactId']
        }
      },
      {
        name: 'add_contact_tags',
        description: 'Add tags to existing contact (APPENDS to existing tags, does not replace). Use this to add tags while keeping existing ones. Tags are used for segmentation, filtering, automation triggers. Tags are case-insensitive. Duplicates are automatically ignored. Returns updated tags array. Use search_contacts first to get contactId.',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: {
              type: 'string',
              description: 'Contact ID to add tags to. Get from search_contacts. Required.'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of tag names to ADD (append) to contact. Tags will be created if they don\'t exist in location. Case-insensitive. Max 20 new tags per call. Each tag max 50 characters. Examples: ["VIP", "Premium", "Newsletter Subscriber"]'
            }
          },
          required: ['contactId', 'tags']
        }
      },
      {
        name: 'remove_contact_tags',
        description: 'Remove specific tags from contact. Only removes specified tags, keeps all others. Case-insensitive matching. If tag doesn\'t exist on contact, silently ignored. Returns updated tags array. Use search_contacts first to get contactId.',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: {
              type: 'string',
              description: 'Contact ID to remove tags from. Required.'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of tag names to REMOVE from contact. Case-insensitive. Tags not found on contact will be ignored. Examples: ["Trial", "Old", "Inactive"]'
            }
          },
          required: ['contactId', 'tags']
        }
      },

      // Task Management
      {
        name: 'get_contact_tasks',
        description: 'Get all tasks (to-dos) for a specific contact. Returns array of tasks with taskId, title, description, dueDate, completed status, assignedTo user. Use this to view existing tasks before creating new ones. Useful for task management workflows.',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: {
              type: 'string',
              description: 'Contact ID to get tasks for. Returns empty array if no tasks exist.'
            }
          },
          required: ['contactId']
        }
      },
      {
        name: 'create_contact_task',
        description: 'Create a new task (to-do) for a contact. Tasks are reminders/action items for team members. Can be assigned to specific users. Due dates trigger notifications. Returns taskId for future updates. Use for follow-up reminders, callbacks, appointments scheduling.',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID to create task for. Required.' },
            title: { type: 'string', description: 'Task title (required). Short description of task. Max 200 characters. Examples: "Follow up call", "Send proposal"' },
            body: { type: 'string', description: 'Task description/notes (optional). Detailed information. Supports HTML. Max 5000 characters.' },
            dueDate: { type: 'string', description: 'Task due date (required). ISO 8601 format. Example: "2025-10-30T14:00:00Z"' },
            completed: { type: 'boolean', description: 'Task completion status (optional). Default: false.' },
            assignedTo: { type: 'string', description: 'User ID to assign task to (optional).' }
          },
          required: ['contactId', 'title', 'dueDate']
        }
      },
      {
        name: 'get_contact_task',
        description: 'Get a specific task for a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            taskId: { type: 'string', description: 'Task ID' }
          },
          required: ['contactId', 'taskId']
        }
      },
      {
        name: 'update_contact_task',
        description: 'Update a task for a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            taskId: { type: 'string', description: 'Task ID' },
            title: { type: 'string', description: 'Task title' },
            body: { type: 'string', description: 'Task description' },
            dueDate: { type: 'string', description: 'Due date (ISO format)' },
            completed: { type: 'boolean', description: 'Task completion status' },
            assignedTo: { type: 'string', description: 'User ID to assign task to' }
          },
          required: ['contactId', 'taskId']
        }
      },
      {
        name: 'delete_contact_task',
        description: 'Delete a task for a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            taskId: { type: 'string', description: 'Task ID' }
          },
          required: ['contactId', 'taskId']
        }
      },
      {
        name: 'update_task_completion',
        description: 'Mark task as completed or incomplete. Quick way to update task status without changing other fields. Returns updated task object.',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            taskId: { type: 'string', description: 'Task ID to update' },
            completed: { type: 'boolean', description: 'Completion status. true = mark complete, false = mark incomplete' }
          },
          required: ['contactId', 'taskId', 'completed']
        }
      },

      // Note Management
      {
        name: 'get_contact_notes',
        description: 'Get all notes for a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' }
          },
          required: ['contactId']
        }
      },
      {
        name: 'create_contact_note',
        description: 'Create a new note for a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            body: { type: 'string', description: 'Note content' },
            userId: { type: 'string', description: 'User ID creating the note' }
          },
          required: ['contactId', 'body']
        }
      },
      {
        name: 'get_contact_note',
        description: 'Get a specific note for a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            noteId: { type: 'string', description: 'Note ID' }
          },
          required: ['contactId', 'noteId']
        }
      },
      {
        name: 'update_contact_note',
        description: 'Update a note for a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            noteId: { type: 'string', description: 'Note ID' },
            body: { type: 'string', description: 'Note content' },
            userId: { type: 'string', description: 'User ID updating the note' }
          },
          required: ['contactId', 'noteId', 'body']
        }
      },
      {
        name: 'delete_contact_note',
        description: 'Delete a note for a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            noteId: { type: 'string', description: 'Note ID' }
          },
          required: ['contactId', 'noteId']
        }
      },

      // Advanced Contact Operations
      {
        name: 'upsert_contact',
        description: 'Smart create OR update contact automatically. Checks if contact exists by email/phone, then creates if new or updates if exists. BEST CHOICE when importing contacts or unsure if contact exists. Eliminates need for manual duplicate checking. Returns contactId and "created" boolean (true if new, false if updated). LocationId auto-handled.',
        inputSchema: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', description: 'Email address (recommended for upsert). Used to find existing contact.' },
            phone: { type: 'string', description: 'Phone number (alternative to email).' },
            firstName: { type: 'string', description: 'First name. Creates/updates this field.' },
            lastName: { type: 'string', description: 'Last name. Creates/updates this field.' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Tags to assign. If updating, REPLACES existing tags.' },
            source: { type: 'string', description: 'Contact source for new contacts. Ignored if contact already exists.' },
            assignedTo: { type: 'string', description: 'User ID to assign contact to (optional).' }
          }
        }
      },
      {
        name: 'get_duplicate_contact',
        description: 'Check if contact already exists by email or phone WITHOUT creating. Returns existing contact object if found, null if not found. Use this for pre-validation before create_contact, or to find contactId without full search. Faster than search_contacts for simple existence check.',
        inputSchema: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', description: 'Email to check for duplicates.' },
            phone: { type: 'string', description: 'Phone to check for duplicates.' }
          }
        }
      },
      {
        name: 'get_contacts_by_business',
        description: 'Get contacts associated with a specific business',
        inputSchema: {
          type: 'object',
          properties: {
            businessId: { type: 'string', description: 'Business ID' },
            limit: { type: 'number', description: 'Maximum number of results' },
            skip: { type: 'number', description: 'Number of results to skip' },
            query: { type: 'string', description: 'Search query' }
          },
          required: ['businessId']
        }
      },
      {
        name: 'get_contact_appointments',
        description: 'Get all appointments for a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' }
          },
          required: ['contactId']
        }
      },

      // Bulk Operations
      {
        name: 'bulk_update_contact_tags',
        description: 'Add or remove tags from multiple contacts in ONE operation. Much more efficient than calling add_contact_tags/remove_contact_tags multiple times. Use for mass segmentation, campaign tagging, or cleanup. Max 100 contacts per call. Returns count of successfully updated contacts.',
        inputSchema: {
          type: 'object',
          properties: {
            contactIds: { type: 'array', items: { type: 'string' }, description: 'Array of contact IDs. Min 1, max 100.' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Tags to add or remove from all specified contacts.' },
            operation: { type: 'string', enum: ['add', 'remove'], description: '"add" = append tags. "remove" = remove tags.' },
            removeAllTags: { type: 'boolean', description: 'If true, removes ALL existing tags before adding new ones (only with operation="add").' }
          },
          required: ['contactIds', 'tags', 'operation']
        }
      },
      {
        name: 'bulk_update_contact_business',
        description: 'Bulk update business association for multiple contacts',
        inputSchema: {
          type: 'object',
          properties: {
            contactIds: { type: 'array', items: { type: 'string' }, description: 'Array of contact IDs' },
            businessId: { type: 'string', description: 'Business ID (null to remove from business)' }
          },
          required: ['contactIds']
        }
      },

      // Followers Management
      {
        name: 'add_contact_followers',
        description: 'Add followers to a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            followers: { type: 'array', items: { type: 'string' }, description: 'Array of user IDs to add as followers' }
          },
          required: ['contactId', 'followers']
        }
      },
      {
        name: 'remove_contact_followers',
        description: 'Remove followers from a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            followers: { type: 'array', items: { type: 'string' }, description: 'Array of user IDs to remove as followers' }
          },
          required: ['contactId', 'followers']
        }
      },

      // Campaign Management
      {
        name: 'add_contact_to_campaign',
        description: 'Add contact to a marketing campaign',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            campaignId: { type: 'string', description: 'Campaign ID' }
          },
          required: ['contactId', 'campaignId']
        }
      },
      {
        name: 'remove_contact_from_campaign',
        description: 'Remove contact from a specific campaign',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' },
            campaignId: { type: 'string', description: 'Campaign ID' }
          },
          required: ['contactId', 'campaignId']
        }
      },
      {
        name: 'remove_contact_from_all_campaigns',
        description: 'Remove contact from all campaigns',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID' }
          },
          required: ['contactId']
        }
      },

      // Workflow Management
      {
        name: 'add_contact_to_workflow',
        description: 'Enroll contact in automation workflow. Triggers workflow automation sequence (emails, SMS, tasks, etc.). Contact will start receiving automated messages based on workflow configuration. Use for onboarding, nurture sequences, follow-ups. Get workflowId from ghl_get_workflows tool first.',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID to enroll in workflow. Required.' },
            workflowId: { type: 'string', description: 'Workflow ID to enroll contact in. Get from ghl_get_workflows tool. Required.' },
            eventStartTime: { type: 'string', description: 'Workflow start time (optional). ISO 8601 format. If not provided, starts immediately.' }
          },
          required: ['contactId', 'workflowId']
        }
      },
      {
        name: 'remove_contact_from_workflow',
        description: 'Unenroll contact from automation workflow. STOPS all pending workflow actions for this contact. Already-sent messages cannot be recalled. Use when contact unsubscribes, opts out, or no longer needs automation.',
        inputSchema: {
          type: 'object',
          properties: {
            contactId: { type: 'string', description: 'Contact ID to remove from workflow.' },
            workflowId: { type: 'string', description: 'Workflow ID to remove contact from.' },
            eventStartTime: { type: 'string', description: 'Optional. If workflow was started with specific eventStartTime, provide it here.' }
          },
          required: ['contactId', 'workflowId']
        }
      }
    ];
  }

  /**
   * Execute a contact tool with the given parameters
   */
  async executeTool(toolName: string, params: any): Promise<any> {
    try {
      switch (toolName) {
        // Basic Contact Management
        case 'create_contact':
          return await this.createContact(params as MCPCreateContactParams);
        case 'search_contacts':
          return await this.searchContacts(params as MCPSearchContactsParams);
        case 'get_contact':
          return await this.getContact(params.contactId);
        case 'update_contact':
          return await this.updateContact(params as MCPUpdateContactParams);
        case 'delete_contact':
          return await this.deleteContact(params.contactId);
        case 'add_contact_tags':
          return await this.addContactTags(params as MCPAddContactTagsParams);
        case 'remove_contact_tags':
          return await this.removeContactTags(params as MCPRemoveContactTagsParams);

        // Task Management
        case 'get_contact_tasks':
          return await this.getContactTasks(params as MCPGetContactTasksParams);
        case 'create_contact_task':
          return await this.createContactTask(params as MCPCreateContactTaskParams);
        case 'get_contact_task':
          return await this.getContactTask(params as MCPGetContactTaskParams);
        case 'update_contact_task':
          return await this.updateContactTask(params as MCPUpdateContactTaskParams);
        case 'delete_contact_task':
          return await this.deleteContactTask(params as MCPDeleteContactTaskParams);
        case 'update_task_completion':
          return await this.updateTaskCompletion(params as MCPUpdateTaskCompletionParams);

        // Note Management
        case 'get_contact_notes':
          return await this.getContactNotes(params as MCPGetContactNotesParams);
        case 'create_contact_note':
          return await this.createContactNote(params as MCPCreateContactNoteParams);
        case 'get_contact_note':
          return await this.getContactNote(params as MCPGetContactNoteParams);
        case 'update_contact_note':
          return await this.updateContactNote(params as MCPUpdateContactNoteParams);
        case 'delete_contact_note':
          return await this.deleteContactNote(params as MCPDeleteContactNoteParams);

        // Advanced Operations
        case 'upsert_contact':
          return await this.upsertContact(params as MCPUpsertContactParams);
        case 'get_duplicate_contact':
          return await this.getDuplicateContact(params as MCPGetDuplicateContactParams);
        case 'get_contacts_by_business':
          return await this.getContactsByBusiness(params as MCPGetContactsByBusinessParams);
        case 'get_contact_appointments':
          return await this.getContactAppointments(params as MCPGetContactAppointmentsParams);

        // Bulk Operations
        case 'bulk_update_contact_tags':
          return await this.bulkUpdateContactTags(params as MCPBulkUpdateContactTagsParams);
        case 'bulk_update_contact_business':
          return await this.bulkUpdateContactBusiness(params as MCPBulkUpdateContactBusinessParams);

        // Followers Management
        case 'add_contact_followers':
          return await this.addContactFollowers(params as MCPAddContactFollowersParams);
        case 'remove_contact_followers':
          return await this.removeContactFollowers(params as MCPRemoveContactFollowersParams);

        // Campaign Management
        case 'add_contact_to_campaign':
          return await this.addContactToCampaign(params as MCPAddContactToCampaignParams);
        case 'remove_contact_from_campaign':
          return await this.removeContactFromCampaign(params as MCPRemoveContactFromCampaignParams);
        case 'remove_contact_from_all_campaigns':
          return await this.removeContactFromAllCampaigns(params as MCPRemoveContactFromAllCampaignsParams);

        // Workflow Management
        case 'add_contact_to_workflow':
          return await this.addContactToWorkflow(params as MCPAddContactToWorkflowParams);
        case 'remove_contact_from_workflow':
          return await this.removeContactFromWorkflow(params as MCPRemoveContactFromWorkflowParams);
      
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error) {
      console.error(`Error executing contact tool ${toolName}:`, error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // IMPLEMENTATION METHODS
  // ═══════════════════════════════════════════════════════════

  // Basic Contact Management
  private async createContact(params: MCPCreateContactParams): Promise<any> {
    try {
      if (!params.email) {
        throw new Error('Email is required');
      }

      const response = await this.ghlClient.createContact({
        locationId: this.ghlClient.getConfig().locationId,
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phone: params.phone,
        tags: params.tags,
        source: params.source || 'ChatGPT MCP'
      });

      if (!response.success) {
        throw new Error(`Failed to create contact: ${response.error || 'Unknown error'}`);
      }

      return {
        success: true,
        contact: response.data,
        message: 'Contact created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create contact: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Search contacts with enhanced response - contactId on top level for AI
   */
  private async searchContacts(params: MCPSearchContactsParams): Promise<any> {
    try {
      const searchQuery = params.email || params.phone || params.query;
      
      if (!searchQuery) {
        throw new Error('At least one search parameter (query, email, or phone) is required');
      }

      console.log('[Contact Tools] Searching contacts with query:', searchQuery);

      const response = await this.ghlClient.searchContacts({
        locationId: this.ghlClient.getConfig().locationId,
        query: searchQuery,
        limit: params.limit || 25
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to search contacts');
      }

      const data = response.data || { contacts: [], total: 0 };
      const contacts = data.contacts || [];
      
      console.log(`[Contact Tools] Found ${contacts.length} contacts`);

      const result: any = {
        success: true,
        contacts: contacts,
        total: data.total || 0,
        message: `Found ${data.total || 0} contacts`
      };

      if (contacts.length > 0) {
        const firstContact = contacts[0];
        result.contactId = firstContact.id;
        result.id = firstContact.id;
        result.email = firstContact.email;
        result.phone = firstContact.phone;
        result.firstName = firstContact.firstName;
        result.lastName = firstContact.lastName;
        result.fullName = `${firstContact.firstName || ''} ${firstContact.lastName || ''}`.trim();
        result.tags = firstContact.tags || [];
        
        console.log('[Contact Tools] First contact ID:', firstContact.id);
      } else {
        console.log('[Contact Tools] No contacts found');
      }

      return result;
    } catch (error) {
      console.error('[Contact Tools] Search error:', error);
      throw new Error(`Failed to search contacts: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get contact by ID with validation to prevent undefined errors
   */
  private async getContact(contactId: string): Promise<any> {
    try {
      if (!contactId || contactId === 'undefined' || contactId === 'null' || contactId.trim() === '') {
        return {
          success: false,
          error: 'Invalid contactId provided',
          message: 'Valid contactId is required. Use search_contacts first to get contactId, then use that ID here.'
        };
      }

      console.log('[Contact Tools] Getting contact with ID:', contactId);

      const response = await this.ghlClient.getContact(contactId);

      if (!response.success) {
        console.error('[Contact Tools] Failed to get contact:', response.error);
        return {
          success: false,
          error: response.error?.message || 'Contact not found',
          message: `Could not find contact with ID: ${contactId}. The contact may have been deleted or the ID is incorrect.`
        };
      }

      console.log('[Contact Tools] Contact retrieved successfully');

      return {
        success: true,
        contact: response.data,
        contactId: response.data?.id,
        email: response.data?.email,
        phone: response.data?.phone,
        firstName: response.data?.firstName,
        lastName: response.data?.lastName,
        fullName: `${response.data?.firstName || ''} ${response.data?.lastName || ''}`.trim(),
        tags: response.data?.tags || [],
        message: 'Contact retrieved successfully'
      };
    } catch (error) {
      console.error('[Contact Tools] Get contact error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get contact. Please verify the contactId is correct.'
      };
    }
  }

  private async updateContact(params: MCPUpdateContactParams): Promise<any> {
    try {
      const response = await this.ghlClient.updateContact(params.contactId, {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phone: params.phone,
        tags: params.tags
      });

      if (!response.success) {
        throw new Error(`Failed to update contact: ${response.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        contact: response.data,
        message: 'Contact updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update contact: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async deleteContact(contactId: string): Promise<any> {
    try {
      const response = await this.ghlClient.deleteContact(contactId);

      if (!response.success) {
        throw new Error(`Failed to delete contact: ${response.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        message: 'Contact deleted successfully'
      };
    } catch (error) {
      throw new Error(`Failed to delete contact: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async addContactTags(params: MCPAddContactTagsParams): Promise<any> {
    try {
      const response = await this.ghlClient.addContactTags(params.contactId, params.tags);

      if (!response.success) {
        throw new Error(`Failed to add contact tags: ${response.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        tags: response.data?.tags || [],
        message: `Successfully added ${params.tags.length} tags to contact`
      };
    } catch (error) {
      throw new Error(`Failed to add contact tags: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async removeContactTags(params: MCPRemoveContactTagsParams): Promise<any> {
    try {
      const response = await this.ghlClient.removeContactTags(params.contactId, params.tags);

      if (!response.success) {
        throw new Error(`Failed to remove contact tags: ${response.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        tags: response.data?.tags || [],
        message: `Successfully removed ${params.tags.length} tags from contact`
      };
    } catch (error) {
      throw new Error(`Failed to remove contact tags: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Task Management
  private async getContactTasks(params: MCPGetContactTasksParams): Promise<GHLTask[]> {
    const response = await this.ghlClient.getContactTasks(params.contactId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to get contact tasks');
    }

    return response.data!;
  }

  private async createContactTask(params: MCPCreateContactTaskParams): Promise<GHLTask> {
    const response = await this.ghlClient.createContactTask(params.contactId, {
      title: params.title,
      body: params.body,
      dueDate: params.dueDate,
      completed: params.completed || false,
      assignedTo: params.assignedTo
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to create contact task');
    }

    return response.data!;
  }

  private async getContactTask(params: MCPGetContactTaskParams): Promise<GHLTask> {
    const response = await this.ghlClient.getContactTask(params.contactId, params.taskId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to get contact task');
    }

    return response.data!;
  }

  private async updateContactTask(params: MCPUpdateContactTaskParams): Promise<GHLTask> {
    const response = await this.ghlClient.updateContactTask(params.contactId, params.taskId, {
      title: params.title,
      body: params.body,
      dueDate: params.dueDate,
      completed: params.completed,
      assignedTo: params.assignedTo
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to update contact task');
    }

    return response.data!;
  }

  private async deleteContactTask(params: MCPDeleteContactTaskParams): Promise<{ succeded: boolean }> {
    const response = await this.ghlClient.deleteContactTask(params.contactId, params.taskId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to delete contact task');
    }

    return response.data!;
  }

  private async updateTaskCompletion(params: MCPUpdateTaskCompletionParams): Promise<GHLTask> {
    const response = await this.ghlClient.updateTaskCompletion(params.contactId, params.taskId, params.completed);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to update task completion');
    }

    return response.data!;
  }

  // Note Management
  private async getContactNotes(params: MCPGetContactNotesParams): Promise<GHLNote[]> {
    const response = await this.ghlClient.getContactNotes(params.contactId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to get contact notes');
    }

    return response.data!;
  }

  private async createContactNote(params: MCPCreateContactNoteParams): Promise<GHLNote> {
    const response = await this.ghlClient.createContactNote(params.contactId, {
      body: params.body,
      userId: params.userId
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to create contact note');
    }

    return response.data!;
  }

  private async getContactNote(params: MCPGetContactNoteParams): Promise<GHLNote> {
    const response = await this.ghlClient.getContactNote(params.contactId, params.noteId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to get contact note');
    }

    return response.data!;
  }

  private async updateContactNote(params: MCPUpdateContactNoteParams): Promise<GHLNote> {
    const response = await this.ghlClient.updateContactNote(params.contactId, params.noteId, {
      body: params.body,
      userId: params.userId
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to update contact note');
    }

    return response.data!;
  }

  private async deleteContactNote(params: MCPDeleteContactNoteParams): Promise<{ succeded: boolean }> {
    const response = await this.ghlClient.deleteContactNote(params.contactId, params.noteId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to delete contact note');
    }

    return response.data!;
  }

  // Advanced Operations
  private async upsertContact(params: MCPUpsertContactParams): Promise<GHLUpsertContactResponse> {
    const response = await this.ghlClient.upsertContact({
      locationId: this.ghlClient.getConfig().locationId,
      firstName: params.firstName,
      lastName: params.lastName,
      name: params.name,
      email: params.email,
      phone: params.phone,
      address1: params.address,
      city: params.city,
      state: params.state,
      country: params.country,
      postalCode: params.postalCode,
      website: params.website,
      timezone: params.timezone,
      companyName: params.companyName,
      tags: params.tags,
      customFields: params.customFields,
      source: params.source,
      assignedTo: params.assignedTo
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to upsert contact');
    }

    return response.data!;
  }

  private async getDuplicateContact(params: MCPGetDuplicateContactParams): Promise<GHLContact | null> {
    try {
      const searchQuery = params.email || params.phone;
      
      if (!searchQuery) {
        return null;
      }

      const response = await this.ghlClient.searchContacts({
        locationId: this.ghlClient.getConfig().locationId,
        query: searchQuery,
        limit: 1
      });

      if (!response.success) {
        return null;
      }

      const data = response.data || { contacts: [] };
      
      if (data.contacts && data.contacts.length > 0) {
        return data.contacts[0];
      }

      return null;
    } catch (error) {
      throw new Error(`Failed to check for duplicate contact: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async getContactsByBusiness(params: MCPGetContactsByBusinessParams): Promise<GHLSearchContactsResponse> {
    const response = await this.ghlClient.getContactsByBusiness(params.businessId, {
      limit: params.limit,
      skip: params.skip,
      query: params.query
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to get contacts by business');
    }

    return response.data!;
  }

  private async getContactAppointments(params: MCPGetContactAppointmentsParams): Promise<GHLAppointment[]> {
    const response = await this.ghlClient.getContactAppointments(params.contactId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to get contact appointments');
    }

    return response.data!;
  }

  // Bulk Operations
  private async bulkUpdateContactTags(params: MCPBulkUpdateContactTagsParams): Promise<GHLBulkTagsResponse> {
    const response = await this.ghlClient.bulkUpdateContactTags(
      params.contactIds,
      params.tags,
      params.operation,
      params.removeAllTags
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to bulk update contact tags');
    }

    return response.data!;
  }

  private async bulkUpdateContactBusiness(params: MCPBulkUpdateContactBusinessParams): Promise<GHLBulkBusinessResponse> {
    const response = await this.ghlClient.bulkUpdateContactBusiness(params.contactIds, params.businessId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to bulk update contact business');
    }

    return response.data!;
  }

  // Followers Management
  private async addContactFollowers(params: MCPAddContactFollowersParams): Promise<GHLFollowersResponse> {
    const response = await this.ghlClient.addContactFollowers(params.contactId, params.followers);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to add contact followers');
    }

    return response.data!;
  }

  private async removeContactFollowers(params: MCPRemoveContactFollowersParams): Promise<GHLFollowersResponse> {
    const response = await this.ghlClient.removeContactFollowers(params.contactId, params.followers);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to remove contact followers');
    }

    return response.data!;
  }

  // Campaign Management
  private async addContactToCampaign(params: MCPAddContactToCampaignParams): Promise<{ succeded: boolean }> {
    const response = await this.ghlClient.addContactToCampaign(params.contactId, params.campaignId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to add contact to campaign');
    }

    return response.data!;
  }

  private async removeContactFromCampaign(params: MCPRemoveContactFromCampaignParams): Promise<{ succeded: boolean }> {
    const response = await this.ghlClient.removeContactFromCampaign(params.contactId, params.campaignId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to remove contact from campaign');
    }

    return response.data!;
  }

  private async removeContactFromAllCampaigns(params: MCPRemoveContactFromAllCampaignsParams): Promise<{ succeded: boolean }> {
    const response = await this.ghlClient.removeContactFromAllCampaigns(params.contactId);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to remove contact from all campaigns');
    }

    return response.data!;
  }

  // Workflow Management
  private async addContactToWorkflow(params: MCPAddContactToWorkflowParams): Promise<{ succeded: boolean }> {
    const response = await this.ghlClient.addContactToWorkflow(
      params.contactId,
      params.workflowId,
      params.eventStartTime
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to add contact to workflow');
    }

    return response.data!;
  }

  private async removeContactFromWorkflow(params: MCPRemoveContactFromWorkflowParams): Promise<{ succeded: boolean }> {
    const response = await this.ghlClient.removeContactFromWorkflow(
      params.contactId,
      params.workflowId,
      params.eventStartTime
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to remove contact from workflow');
    }

    return response.data!;
  }
}
