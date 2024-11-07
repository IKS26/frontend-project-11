const state = {
	feeds: [], // Список RSS-лент
	posts: [], // Список постов
	feedback: '', // Сообщения об ошибках или успехе
 };
 
 export function addRss(feed, posts, state) {
	if (Array.isArray(state.feeds) && Array.isArray(state.posts)) {
	  state.feeds.push(feed);
	  state.posts.push(...posts);
	  state.feedback = 'rss_added';
	} else {
	  console.error('State feeds or posts are not arrays.');
	}
 }
 
 export default state;
 