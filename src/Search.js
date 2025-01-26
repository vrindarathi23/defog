// Load configuration file
const fs = require('fs');
const path = require('path');

async function searchGoogle(query, searchApiKey, searchEngineId, baseUrl, numPages = 3) {
  let allResults = [];
  
  for (let start = 1; start <= numPages; start++) {
    try {
      const url = `${baseUrl}?key=${searchApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=10&start=${start * 10 + 1}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      allResults = allResults.concat(data.items || []);
    } catch (error) {
      console.error('Error performing search:', error.message);
      break;
    }
  }

  return allResults;
}

module.exports = { searchGoogle };