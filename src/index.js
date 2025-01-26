const { GoogleGenerativeAI } = require('@google/generative-ai');
const { searchGoogle } = require('./Search');
const { loadAllSidesData, 
        filterArticles,
        classifyArticles, 
        groupAndSelectArticles 
      } = require('./AllSidesClassification');
const { summarizeArticles } = require('./summarizeArticles');

const fs = require('fs').promises;
const path = require('path');

// Read the JSON config file
const configPath = path.join(__dirname, 'google_custom_search_config.json');
const config = require(configPath);

// Extract details from config
const { searchApiKey, searchEngineId, baseUrl, geminiApiKey } = config;

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Main function to execute the entire pipeline
(async () => {
  try {
    // 1. Load AllSides CSV data
    await loadAllSidesData('../data/allsides.csv');

    // 2. Read the first line from main_topics.txt
    let query = "";
    try {
      const data = await fs.readFile('./main_topics.txt', 'utf8');
      query = data.split('\n')[0]; // Save the first line for the query
    } catch (err) {
      console.error('Error reading main_topics.txt:', err);
      return;
    }

    // 3. Search Google for articles related to the topic
    const topic = query;
    let results = [];
    try {
      results = await searchGoogle(topic, searchApiKey, searchEngineId, baseUrl, 3);
    } catch (err) {
      console.error('Error performing search:', err);
      return;
    }

    // 4. Filter articles to only include those with AllSides ratings
    const filteredArticles = await filterArticles(results, model);

    // 5. Classify articles by bias using AllSides ratings
    const classifiedArticles = classifyArticles(filteredArticles);

    // 6. Group articles by their bias
    const groupedArticles = groupAndSelectArticles(classifiedArticles);

    // 7. Summarize the articles
    const summarizedArticles = await summarizeArticles(groupedArticles, model);

    // 8. Output summarized articles
    console.log(JSON.stringify(summarizedArticles, null, 2));
  } catch (err) {
    console.error('Error in pipeline execution:', err);
  }
})();
