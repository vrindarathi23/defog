const { searchGoogle } = require('./Search');
const { loadAllSidesData, classifyArticles, groupAndSelectArticles } = require('./AllSidesClassification');
const { summarizeArticles } = require('./summarizeArticles');

// Main function to execute the whole process
(async () => {
  // 1. Load AllSides CSV data
  await loadAllSidesData('./data/allsides.csv');

  // 2. Search Google for articles related to a topic
  const topic = 'Climate Change';
  const articles = await searchGoogle(topic, 20); // You can change the number of results here

  // 3. Classify articles by bias using AllSides ratings
  const classifiedArticles = classifyArticles(articles);

  // 4. Group articles by their bias
  const groupedArticles = groupAndSelectArticles(classifiedArticles);

  // 5. Summarize the articles
  const summarizedArticles = await summarizeArticles(groupedArticles);

  // 6. Output summarized articles
  console.log(JSON.stringify(summarizedArticles, null, 2));
})();
