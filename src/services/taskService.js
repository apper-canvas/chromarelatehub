import { toast } from 'sonner';

// Get ApperClient instance
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// All fields from task table for fetch operations
const ALL_TASK_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title', 'description', 'due_date', 'priority', 'completed', 'contact_id'
];

// Only updateable fields for create/update operations
const UPDATEABLE_TASK_FIELDS = [
  'Name', 'Tags', 'Owner', 'title', 'description', 'due_date', 'priority', 'completed', 'contact_id'
];

export const taskService = {
  // Fetch all tasks with optional filtering
  async fetchAllTasks(filters = {}) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_TASK_FIELDS,
        orderBy: [
          {
            fieldName: "due_date",
            SortType: "ASC"
          }
        ]
      };

      const whereConditions = [];

      // Add priority filter if provided
      if (filters.priority && filters.priority !== 'all') {
        whereConditions.push({
          fieldName: "priority",
          operator: "ExactMatch",
          values: [filters.priority]
        });
      }

      // Add completion status filter if provided
      if (filters.completed !== undefined && filters.completed !== 'all') {
        whereConditions.push({
          fieldName: "completed",
          operator: "ExactMatch",
          values: [filters.completed === 'true' || filters.completed === true]
        });
      }

      if (whereConditions.length > 0) {
        params.where = whereConditions;
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
                  operator: "AND"
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

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response || !response.data) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  },

  // Get single task by ID
  async getTaskById(taskId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_TASK_FIELDS
      };

      const response = await apperClient.getRecordById('task', taskId, params);
      
      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      toast.error("Failed to fetch task details");
      return null;
    }
  },

  // Create new task
  async createTask(taskData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      UPDATEABLE_TASK_FIELDS.forEach(field => {
        if (taskData[field] !== undefined && taskData[field] !== null) {
          filteredData[field] = taskData[field];
        }
      });

      // Format date field
      if (filteredData.due_date) {
        const date = new Date(filteredData.due_date);
        filteredData.due_date = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      // Ensure completed is boolean
      if (filteredData.completed !== undefined) {
        filteredData.completed = Boolean(filteredData.completed);
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          toast.success("Task created successfully");
          return successfulRecords[0].data;
        }
      }

      toast.error("Failed to create task");
      return null;
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      throw error;
    }
  },

  // Update existing task
  async updateTask(taskId, taskData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: taskId };
      UPDATEABLE_TASK_FIELDS.forEach(field => {
        if (taskData[field] !== undefined && taskData[field] !== null) {
          filteredData[field] = taskData[field];
        }
      });

      // Format date field
      if (filteredData.due_date) {
        const date = new Date(filteredData.due_date);
        filteredData.due_date = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      // Ensure completed is boolean
      if (filteredData.completed !== undefined) {
        filteredData.completed = Boolean(filteredData.completed);
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          toast.success("Task updated successfully");
          return successfulUpdates[0].data;
        }
      }

      toast.error("Failed to update task");
      return null;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      throw error;
    }
  },

  // Delete task(s)
  async deleteTask(taskIds) {
    try {
      const apperClient = getApperClient();
      
      const idsArray = Array.isArray(taskIds) ? taskIds : [taskIds];
      
      const params = {
        RecordIds: idsArray
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        if (successfulDeletions.length > 0) {
          toast.success(`${successfulDeletions.length} task(s) deleted successfully`);
          return true;
        }
      }

      toast.error("Failed to delete task(s)");
      return false;
    } catch (error) {
      console.error("Error deleting task(s):", error);
      toast.error("Failed to delete task(s)");
      throw error;
    }
  }
};