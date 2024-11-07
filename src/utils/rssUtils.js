import axios from 'axios';

export function loadRSS(url) {
	const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
	console.log('Fetching from:', proxyUrl);
 
	return axios.get(proxyUrl)
	  .then((response) => {
		 console.log('Response received:', response);
		 return response.data.contents;
	  })
	  .catch((error) => {
		 console.error('Network error occurred:', error);
		 throw new Error('network_error');
	  });
}	 

export function parseRSS(data) {
	return new Promise((resolve, reject) => {
	  const parser = new DOMParser();
	  const xml = parser.parseFromString(data, 'application/xml');
	  
	  const parseError = xml.querySelector('parsererror');
	  if (parseError) {
		 console.error('Parsing error:', parseError.textContent);
		 reject(new Error('parsing_error'));
	  } else {
		 try {
			const title = xml.querySelector('channel > title').textContent;
			const description = xml.querySelector('channel > description').textContent;
			const items = Array.from(xml.querySelectorAll('item')).map((item) => ({
			  title: item.querySelector('title').textContent,
			  link: item.querySelector('link').textContent,
			}));
		 
			resolve({ title, description, items });
		 } catch (error) {
			console.error('Error parsing RSS data:', error);
			reject(new Error('parsing_error'));
		 }
	  }
	});
 }

