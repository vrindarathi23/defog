const axios = require('axios');
const fs = require('fs');

const getDownloadUrl = async (videoUrl) => {
    const options = {
      method: 'GET',
      url: 'https://tiktok-video-downloader-api.p.rapidapi.com/media',
      params: {
        videoUrl: videoUrl,
      },
      headers: {
        'x-rapidapi-key': 'b1e137cf59msh8d674ca76dd6fbbp16d597jsn490493f5e85a',
        'x-rapidapi-host': 'tiktok-video-downloader-api.p.rapidapi.com',
      },
    };
  
    try {
      // Fetch the media information (including downloadUrl)
      const response = await axios.request(options);
      const { downloadUrl } = response.data;
  
      console.log('First response received, download URL:', downloadUrl);
      return downloadUrl;
  
    } catch (error) {
      console.error('Error fetching download URL:', error.message);
      throw error;
    }
  };

const downloadVideo = async (downloadUrl, outputFile) => {
    try {
        const videoStream = await axios({
        method: 'GET',
        url: downloadUrl,
        responseType: 'stream', // Stream the video content
        });

        // Create a write stream to save the file
        const writer = fs.createWriteStream(outputFile);

        // Pipe the response data to the file
        videoStream.data.pipe(writer);

        console.log('Video successfully downloaded');

        // You can process the video stream here, e.g., save it to a file
        return videoStream.data;

    } catch (error) {
        console.error('Error downloading the video:', error.message);
        throw error;
    }
};

(async () => {
    const videoUrl = 'https://www.tiktok.com/@komo4seattle/video/7459882215321767214?_r=1&_t=ZT-8tN0imeGxgM'; // Replace with your TikTok video URL
    
    try {
      const downloadUrl = await getDownloadUrl(videoUrl);
      await downloadVideo(downloadUrl, "downloaded_videos/test.mp4");
    } catch (error) {
      console.error('Failed to download the video:', error);
    }
  })();

