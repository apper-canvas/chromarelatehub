import { toast } from 'sonner';

// Get ApperClient instance
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// All fields from contact table for fetch operations
const ALL_CONTACT_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'first_name', 'last_name', 'email', 'phone', 'company', 'status'
];

// Only updateable fields for create/update operations
const UPDATEABLE_CONTACT_FIELDS = [
  'Name', 'Tags', 'Owner', 'first_name', 'last_name', 'email', 'phone', 'company', 'status'
];

export const contactService = {
  // Fetch all contacts with optional filtering
  async fetchAllContacts(filters = {}) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_CONTACT_FIELDS,
        orderBy: [
          {
            fieldName: "CreatedOn",
            SortType: "DESC"
          }
        ]
      };

      // Add status filter if provided
      if (filters.status && filters.status !== 'all') {
        params.where = [
          {
            fieldName: "status",
            operator: "ExactMatch",
            values: [filters.status]
          }
        ];
      }

      // Add search filter if provided
      if (filters.search) {
        const searchConditions = [
          {
            fieldName: "first_name",
            operator: "Contains",
            values: [filters.search]
          },
          {
            fieldName: "last_name", 
            operator: "Contains",
            values: [filters.search]
          },
          {
            fieldName: "email",
            operator: "Contains", 
            values: [filters.search]
          },
          {
            fieldName: "company",
            operator: "Contains",
            values: [filters.search]
          }
        ];

        if (params.where) {
          params.whereGroups = [
            {
              operator: "AND",
              subGroups: [
                {
                  conditions: params.where,
                  operator: ""
                },
                {
                  conditions: searchConditions,
                  operator: "OR"
                }
              ]
            }
          ];
          delete params.where;
        } else {
          params.whereGroups = [
            {
              operator: "OR",
              subGroups: [
                {
                  conditions: searchConditions,
                  operator: "OR"
                }
              ]
            }
          ];
        }
      }

      const response = await apperClient.fetchRecords('contact', params);
      
      if (!response || !response.data) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts");
      return [];
    }
  },

  // Get single contact by ID
  async getContactById(contactId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_CONTACT_FIELDS
      };

      const response = await apperClient.getRecordById('contact', contactId, params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${contactId}:`, error);
      toast.error("Failed to fetch contact details");
      return null;
    }
  },

  // Create new contact
  async createContact(contactData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      UPDATEABLE_CONTACT_FIELDS.forEach(field => {
        if (contactData[field] !== undefined && contactData[field] !== null) {
          filteredData[field] = contactData[field];
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('contact', params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          toast.success("Contact created successfully");
          return successfulRecords[0].data;
        }
      }

      toast.error("Failed to create contact");
      return null;
    } catch (error) {
      console.error("Error creating contact:", error);
      toast.error("Failed to create contact");
      throw error;
    }
  },

  // Update existing contact
  async updateContact(contactId, contactData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: contactId };
      UPDATEABLE_CONTACT_FIELDS.forEach(field => {
        if (contactData[field] !== undefined && contactData[field] !== null) {
          filteredData[field] = contactData[field];
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('contact', params);
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          toast.success("Contact updated successfully");
          return successfulUpdates[0].data;
        }
      }

      toast.error("Failed to update contact");
      return null;
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact");
      throw error;
    }
  },

  // Delete contact(s)
  async deleteContact(contactIds) {
    try {
      const apperClient = getApperClient();
      
      const idsArray = Array.isArray(contactIds) ? contactIds : [contactIds];
      
      const params = {
        RecordIds: idsArray
      };

      const response = await apperClient.deleteRecord('contact', params);
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        if (successfulDeletions.length > 0) {
          toast.success(`${successfulDeletions.length} contact(s) deleted successfully`);
          return true;
        }
      }

      toast.error("Failed to delete contact(s)");
      return false;
    } catch (error) {
      console.error("Error deleting contact(s):", error);
      toast.error("Failed to delete contact(s)");
      throw error;
    }
  }
};