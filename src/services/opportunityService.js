import { toast } from 'sonner';

// Get ApperClient instance
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// All fields from opportunity table for fetch operations
const ALL_OPPORTUNITY_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title', 'value', 'stage', 'contact_id'
];

// Only updateable fields for create/update operations
const UPDATEABLE_OPPORTUNITY_FIELDS = [
  'Name', 'Tags', 'Owner', 'title', 'value', 'stage', 'contact_id'
];

export const opportunityService = {
  // Fetch all opportunities with optional filtering
  async fetchAllOpportunities(filters = {}) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_OPPORTUNITY_FIELDS,
        orderBy: [
          {
            fieldName: "CreatedOn",
            SortType: "DESC"
          }
        ]
      };

      // Add stage filter if provided
      if (filters.stage && filters.stage !== 'all') {
        params.where = [
          {
            fieldName: "stage",
            operator: "ExactMatch",
            values: [filters.stage]
          }
        ];
      }

      // Add search filter if provided
      if (filters.search) {
        const searchConditions = [
          {
            fieldName: "title",
            operator: "Contains",
            values: [filters.search]
          },
          {
            fieldName: "Name",
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

      const response = await apperClient.fetchRecords('opportunity', params);
      
      if (!response || !response.data) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      toast.error("Failed to fetch opportunities");
      return [];
    }
  },

  // Get single opportunity by ID
  async getOpportunityById(opportunityId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_OPPORTUNITY_FIELDS
      };

      const response = await apperClient.getRecordById('opportunity', opportunityId, params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching opportunity with ID ${opportunityId}:`, error);
      toast.error("Failed to fetch opportunity details");
      return null;
    }
  },

  // Create new opportunity
  async createOpportunity(opportunityData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      UPDATEABLE_OPPORTUNITY_FIELDS.forEach(field => {
        if (opportunityData[field] !== undefined && opportunityData[field] !== null) {
          filteredData[field] = opportunityData[field];
        }
      });

      // Ensure value is a number
      if (filteredData.value) {
        filteredData.value = parseFloat(filteredData.value);
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('opportunity', params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          toast.success("Opportunity created successfully");
          return successfulRecords[0].data;
        }
      }

      toast.error("Failed to create opportunity");
      return null;
    } catch (error) {
      console.error("Error creating opportunity:", error);
      toast.error("Failed to create opportunity");
      throw error;
    }
  },

  // Update existing opportunity
  async updateOpportunity(opportunityId, opportunityData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: opportunityId };
      UPDATEABLE_OPPORTUNITY_FIELDS.forEach(field => {
        if (opportunityData[field] !== undefined && opportunityData[field] !== null) {
          filteredData[field] = opportunityData[field];
        }
      });

      // Ensure value is a number
      if (filteredData.value) {
        filteredData.value = parseFloat(filteredData.value);
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('opportunity', params);
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          toast.success("Opportunity updated successfully");
          return successfulUpdates[0].data;
        }
      }

      toast.error("Failed to update opportunity");
      return null;
    } catch (error) {
      console.error("Error updating opportunity:", error);
      toast.error("Failed to update opportunity");
      throw error;
    }
  },

  // Delete opportunity(s)
  async deleteOpportunity(opportunityIds) {
    try {
      const apperClient = getApperClient();
      
      const idsArray = Array.isArray(opportunityIds) ? opportunityIds : [opportunityIds];
      
      const params = {
        RecordIds: idsArray
      };

      const response = await apperClient.deleteRecord('opportunity', params);
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        if (successfulDeletions.length > 0) {
          toast.success(`${successfulDeletions.length} opportunity(s) deleted successfully`);
          return true;
        }
      }

      toast.error("Failed to delete opportunity(s)");
      return false;
    } catch (error) {
      console.error("Error deleting opportunity(s):", error);
      toast.error("Failed to delete opportunity(s)");
      throw error;
    }
  }
};