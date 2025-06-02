import { toast } from 'sonner';

// Get ApperClient instance
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// All fields from Activity1 table for fetch operations
const ALL_ACTIVITY_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'type', 'description', 'date', 'contact_id'
];

// Only updateable fields for create/update operations
const UPDATEABLE_ACTIVITY_FIELDS = [
  'Name', 'Tags', 'Owner', 'type', 'description', 'date', 'contact_id'
];

export const activityService = {
  // Fetch all activities with optional filtering
  async fetchAllActivities(filters = {}) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_ACTIVITY_FIELDS,
        orderBy: [
          {
            fieldName: "date",
            SortType: "DESC"
          }
        ]
      };

      // Add type filter if provided
      if (filters.type && filters.type !== 'all') {
        params.where = [
          {
            fieldName: "type",
            operator: "ExactMatch",
            values: [filters.type]
          }
        ];
      }

      // Add search filter if provided
      if (filters.search) {
        const searchConditions = [
          {
            fieldName: "type",
            operator: "Contains",
            values: [filters.search]
          },
          {
            fieldName: "description",
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

      const response = await apperClient.fetchRecords('Activity1', params);
      
      if (!response || !response.data) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to fetch activities");
      return [];
    }
  },

  // Get single activity by ID
  async getActivityById(activityId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_ACTIVITY_FIELDS
      };

      const response = await apperClient.getRecordById('Activity1', activityId, params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching activity with ID ${activityId}:`, error);
      toast.error("Failed to fetch activity details");
      return null;
    }
  },

  // Create new activity
  async createActivity(activityData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      UPDATEABLE_ACTIVITY_FIELDS.forEach(field => {
        if (activityData[field] !== undefined && activityData[field] !== null) {
          filteredData[field] = activityData[field];
        }
      });

      // Format DateTime field
      if (filteredData.date) {
        const date = new Date(filteredData.date);
        filteredData.date = date.toISOString(); // ISO 8601 format for DateTime
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('Activity1', params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          toast.success("Activity created successfully");
          return successfulRecords[0].data;
        }
      }

      toast.error("Failed to create activity");
      return null;
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error("Failed to create activity");
      throw error;
    }
  },

  // Update existing activity
  async updateActivity(activityId, activityData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: activityId };
      UPDATEABLE_ACTIVITY_FIELDS.forEach(field => {
        if (activityData[field] !== undefined && activityData[field] !== null) {
          filteredData[field] = activityData[field];
        }
      });

      // Format DateTime field
      if (filteredData.date) {
        const date = new Date(filteredData.date);
        filteredData.date = date.toISOString(); // ISO 8601 format for DateTime
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('Activity1', params);
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          toast.success("Activity updated successfully");
          return successfulUpdates[0].data;
        }
      }

      toast.error("Failed to update activity");
      return null;
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Failed to update activity");
      throw error;
    }
  },

  // Delete activity(s)
  async deleteActivity(activityIds) {
    try {
      const apperClient = getApperClient();
      
      const idsArray = Array.isArray(activityIds) ? activityIds : [activityIds];
      
      const params = {
        RecordIds: idsArray
      };

      const response = await apperClient.deleteRecord('Activity1', params);
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        if (successfulDeletions.length > 0) {
          toast.success(`${successfulDeletions.length} activity(s) deleted successfully`);
          return true;
        }
      }

      toast.error("Failed to delete activity(s)");
      return false;
    } catch (error) {
      console.error("Error deleting activity(s):", error);
      toast.error("Failed to delete activity(s)");
      throw error;
    }
  }
};