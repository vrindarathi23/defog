const fs = require('fs');
const axios = require('axios');

let allSidesData = [];

// Load the AllSides bias ratings CSV file
async function loadAllSidesData(filePath) {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const rows = rawData.split('\n').slice(1); // Skip header row
  allSidesData = rows.map(row => {
    const [name, bias] = row.split(',').slice(0,2);
    return { name: name, bias: combineBiases(bias) };
  });
}

// Combine biases into broader categories
function combineBiases(bias) {
  if (['left', 'left-center'].includes(bias)) return 'Left';
  if (['right', 'right-enter'].includes(bias)) return 'Right';
  if (bias === 'Center') return 'Center';
  return 'Unknown';
}

// Fetch website name from the Gemini API
async function getWebsiteNameFromUrl(url, model) {
  try {
    // attempt to match the domain of the search result url to the domain of 
    const prompt = `
I need to match the domain of the following URL: ${url} to a media outlet domain. 
Please follow these steps:
1. Go through each media outlet name in this list: ${JSON.stringify(allSidesData.map(item => item.name))}.
2. For each outlet name, find its homepage URL.
3. Perform a case-insensitive match between the domain of the provided URL and the homepage URL.
4. If a match is found, return the name of the outlet (NOT the URL).
5. If no match is found, return "n/a".
6. Do not include any explanations or extra text. Just return the outlet name or "n/a".
`;
    // const prompt = `Here is a link to an article: ${url}. Can you please identify the name of the media outlet that posted the article. If the outlet is one of the names present in this table ${allSidesData}, please return the exact match. If it ABSOLUTELY CANNOT match anything on the list, return me "n/a".`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch {
    console.log('Error generating text');
    return null;
  }
}

// Filter articles to only include those that map to AllSides dataset names
async function filterArticles(articles, model) {
  const filteredArticles = [];
  for (const article of articles) {
    const websiteName = await getWebsiteNameFromUrl(article.link, model);

    // Check if the website name exists in the AllSides data
    if (websiteName && allSidesData.some(item => item.name === websiteName)) {
      filteredArticles.push({ ...article, name: websiteName });
    }
  }
  return filteredArticles;
}

// Classify articles by bias based on AllSides data
function classifyArticles(articles) {
  return articles.map(article => {
    const bias = allSidesData.find(item => item.name === article.name)?.bias || 'Unknown';
    return { ...article, bias };
  });
}

// Group articles by their bias and select 3-5 articles from each group
// function groupAndSelectArticles(classifiedArticles) {
//   const grouped = classifiedArticles.reduce((acc, article) => {
//     if (acc[article.bias] === 'Unknown') {
//       acc[article.bias] = [];
//     }
//     acc[article.bias].push(article);
//     return acc;
//   }, {});

//   // Select 3-5 articles from each group
//   const selectedArticles = {};
//   Object.keys(grouped).forEach(bias => {
//     selectedArticles[bias] = grouped[bias].slice(0, 5); // Adjust the slice as necessary
//   });

//   return selectedArticles;
// }

function groupAndSelectArticles(classifiedArticles) {
  const grouped = classifiedArticles.reduce((acc, article) => {
    // Initialize the array for each bias if it doesn't exist
    if (!acc[article.bias]) {
      acc[article.bias] = [];
    }
    acc[article.bias].push(article);
    return acc;
  }, {}); // Initialize with an empty object

  // Select 3-5 articles from each group
  const selectedArticles = {};
  Object.keys(grouped).forEach(bias => {
    selectedArticles[bias] = grouped[bias].slice(0, 5);
  });

  return selectedArticles;
}

module.exports = { loadAllSidesData, filterArticles, classifyArticles, groupAndSelectArticles };
