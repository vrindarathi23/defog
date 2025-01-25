// Load configuration file
const fs = require('fs');
const path = require('path');

// Read the JSON config file
const configPath = path.join(__dirname, 'google_custom_search_config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Extract details from config
const { apiKey, searchEngineId, baseUrl } = config;

// Function to perform a search query
async function searchGoogle(query) {
  try {
    // Construct the API URL with query parameters
    const url = `${baseUrl}?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=10`;

    // Fetch data from the API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log('Search Results:', data.items);
  } catch (error) {
    console.error('Error performing search:', error.message);
  }
}

// Example usage
searchGoogle('food insecurity');
