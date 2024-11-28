const updateFeedback = (feedbackElement, message, isSuccess = false) => {
  // eslint-disable-next-line no-param-reassign
  feedbackElement.textContent = message;
  feedbackElement.classList.toggle('text-danger', !isSuccess);
  feedbackElement.classList.toggle('text-success', isSuccess);
};

const updateInputFieldValidation = (inputField, isValid) => {
  inputField.classList.toggle('is-invalid', !isValid);
};

export const handleFormValidationError = (
  form,
  domElements,
  i18nextInstance,
) => {
  const { inputField, feedback } = domElements;
  if (!inputField || !feedback) return;

  updateFeedback(feedback, i18nextInstance.t(form.error), form.isValid);
  updateInputFieldValidation(inputField, form.isValid);
};

export const handleLoadingProcess = (
  loadingProcess,
  domElements,
  i18nextInstance,
) => {
  const {
    inputField, addButton, feedback, form,
  } = domElements;
  if (!inputField || !addButton || !feedback || !form) return;

  switch (loadingProcess.status) {
    case 'idle':
      addButton.disabled = false;
      inputField.focus();
      break;
    case 'loading':
      inputField.classList.remove('border-danger');
      updateFeedback(feedback, '', true);
      inputField.readOnly = true;
      addButton.disabled = true;
      break;
    case 'success':
      updateFeedback(feedback, i18nextInstance.t('rss_added'), true);
      inputField.readOnly = false;
      addButton.disabled = false;
      form.reset();
      inputField.focus();
      break;
    case 'fail':
      updateFeedback(feedback, i18nextInstance.t(loadingProcess.error), false);
      inputField.classList.add('border-danger');
      inputField.readOnly = false;
      addButton.disabled = false;
      inputField.focus();
      break;
    default:
      console.error(`Unknown loading process state: ${loadingProcess.status}`);
  }
};

export const handleLoadingProcessError = (error, i18nextInstance) => (error.message === 'network_error'
  ? i18nextInstance.t('network_error')
  : i18nextInstance.t('invalid_rss'));
