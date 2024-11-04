import * as yup from 'yup';

export function validateUrl(url, existingFeeds) {
  const schema = yup.string()
    .url('Неверный формат URL')
    .notOneOf(existingFeeds, 'RSS уже добавлен')
    .required('Поле обязательно для заполнения');

  return schema.validate(url);
}
