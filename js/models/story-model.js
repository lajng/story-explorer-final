// js/models/story-model.js - Fixed with Authentication
class StoryModel {
  static BASE_URL = 'https://story-api.dicoding.dev/v1';

  // Get all stories with authentication
  static async getStories(page = 1, size = 10, location = 0) {
    try {
      // Check authentication
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        location: location.toString()
      });

      const response = await fetch(`${this.BASE_URL}/stories?${params}`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders()
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          AuthService.logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(result.message || 'Failed to fetch stories');
      }

      return result.listStory || [];
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  // Get story detail
  static async getStoryDetail(id) {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.BASE_URL}/stories/${id}`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders()
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          AuthService.logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(result.message || 'Failed to fetch story detail');
      }

      return result.story;
    } catch (error) {
      console.error('Error fetching story detail:', error);
      throw error;
    }
  }

  // Add new story
  static async addStory(storyData) {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      // Validate required fields
      if (!storyData.description || !storyData.photo) {
        throw new Error('Description and photo are required');
      }

      const formData = new FormData();
      formData.append('description', storyData.description);
      formData.append('photo', storyData.photo);

      // Add location if provided
      if (storyData.lat && storyData.lon) {
        formData.append('lat', storyData.lat.toString());
        formData.append('lon', storyData.lon.toString());
      }

      const response = await fetch(`${this.BASE_URL}/stories`, {
        method: 'POST',
        headers: AuthService.getAuthHeadersForFormData(),
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          AuthService.logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(result.message || 'Failed to add story');
      }

      return result;
    } catch (error) {
      console.error('Error adding story:', error);
      throw error;
    }
  }

  // Get stories with location for map
  static async getStoriesWithLocation(page = 1, size = 30) {
    try {
      return await this.getStories(page, size, 1); // location = 1 to include location data
    } catch (error) {
      console.error('Error fetching stories with location:', error);
      throw error;
    }
  }

  // Search stories
  static async searchStories(query, page = 1, size = 10) {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        location: '0'
      });

      const response = await fetch(`${this.BASE_URL}/stories?${params}`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders()
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          AuthService.logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(result.message || 'Failed to search stories');
      }

      // Filter stories based on query
      const stories = result.listStory || [];
      if (!query) return stories;

      return stories.filter(story => 
        story.name.toLowerCase().includes(query.toLowerCase()) ||
        story.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching stories:', error);
      throw error;
    }
  }

  // Validate story data
  static validateStoryData(data) {
    const errors = [];

    if (!data.description || data.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (data.description && data.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }

    if (!data.photo) {
      errors.push('Photo is required');
    }

    if (data.photo && data.photo.size > 5 * 1024 * 1024) { // 5MB limit
      errors.push('Photo size must be less than 5MB');
    }

    if (data.lat && (data.lat < -90 || data.lat > 90)) {
      errors.push('Invalid latitude value');
    }

    if (data.lon && (data.lon < -180 || data.lon > 180)) {
      errors.push('Invalid longitude value');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format story data for display
  static formatStoryForDisplay(story) {
    try {
      return {
        id: story.id,
        name: story.name || 'Anonymous',
        description: story.description || '',
        photoUrl: story.photoUrl || '',
        createdAt: story.createdAt ? new Date(story.createdAt) : new Date(),
        lat: story.lat || null,
        lon: story.lon || null
      };
    } catch (error) {
      console.error('Error formatting story:', error);
      return null;
    }
  }

  // Batch format stories
  static formatStoriesForDisplay(stories) {
    if (!Array.isArray(stories)) return [];
    
    return stories
      .map(story => this.formatStoryForDisplay(story))
      .filter(story => story !== null);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StoryModel;
}