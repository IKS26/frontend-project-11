// Функция для добавления RSS в список
export function addRss(url, state) {
	const feedbackElement = document.querySelector('.feedback');
	state.feeds.push(url);
	state.feedback = 'RSS успешно добавлен';
	
	// Добавляем класс для зеленого цвета
	feedbackElement.classList.remove('text-danger');
	feedbackElement.classList.add('text-success');
	
}