// Функция для добавления новых RSS-лент (url)
export function addRss(url, state) {
	state.feeds.push(url);
	state.feedback = 'rss_added'; // Устанавливаем ключ для успешного добавления
}
