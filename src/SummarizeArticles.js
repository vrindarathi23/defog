// const axios = require('axios');
// const { geminiApiKey } = require('./google_custom_search.config.json');

// async function summarizeArticles(articles) {
//   const summarizedArticles = [];

//   for (const article of articles) {
//     const summary = await generateSummary(article.snippet);
//     summarizedArticles.push({ ...article, summary });
//   }

//   return summarizedArticles;
// }

// async function generateSummary(text) {
//   const prompt = `Summarize the following text:\n\n${text}`;
//   const response = await axios.post('https://api.openai.com/v1/completions', {
//     model: 'text-davinci-003',
//     prompt: prompt,
//     max_tokens: 100
//   }, {
//     headers: { 'Authorization': `Bearer ${openAiApiKey}` }
//   });

//   return response.data.choices[0].text.trim();
// }

// module.exports = { summarizeArticles };

async function summarizeArticles(groupedArticles, model) {
  const summarizedBiases = {};

  for (const [bias, articles] of Object.entries(groupedArticles)) {
    if (['Left', 'Center', 'Right'].includes(bias)) {
      const combinedSnippets = articles
        .slice(0, 3)
        .map(article => article.snippet)
        .join('\n\n');

      try {
        const prompt = `Synthesize a comprehensive summary of the following article snippets, representing the ${bias} perspective. Provide an objective, concise overview that captures the key themes and viewpoints:\n\n${combinedSnippets}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        summarizedBiases[bias] = {
          summary: response.text(),
          sourceCount: articles.length
        };
      } catch (error) {
        console.error(`Error summarizing ${bias} perspective: ${error}`);
      }
    }
  }

  return summarizedBiases;
}

module.exports = { summarizeArticles };