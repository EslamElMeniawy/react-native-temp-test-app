import {Linking} from 'react-native';

import {translate} from 'core';

const getLogMessage = (message: string) => {
  return `## LinkingUtils: ${message}`;
};

export const openUrl = (url?: string, errorMessageKey?: string) => {
  console.info(getLogMessage('openUrl'), url);

  if (url && url.length) {
    open(url, errorMessageKey || 'error_open_url');
  }
};

export const openEmail = (
  email?: string,
  subject?: string,
  body?: string,
  errorMessageKey?: string,
) => {
  console.info(getLogMessage('openEmail'), email, subject, body);

  if (
    (email && email.length) ||
    (subject && subject.length) ||
    (body && body.length)
  ) {
    let emailLink = 'mailto:';

    if (email && email.length) {
      emailLink += email;
    }

    if ((subject && subject.length) || (body && body.length)) {
      emailLink += '?';

      if (subject && subject.length) {
        emailLink += `subject=${subject || ''}`;
      }

      if (body && body.length) {
        if (subject && subject.length) {
          emailLink += '&';
        }

        emailLink += `body=${body || ''}`;
      }
    }

    console.info(getLogMessage('emailLink'), emailLink);
    open(emailLink, errorMessageKey || 'error_open_mail');
  }
};

export const openPhone = (phone?: string, errorMessageKey?: string) => {
  console.info(getLogMessage('openPhone'), phone);

  if (phone && phone.length) {
    open(`tel:${phone}`, errorMessageKey || 'error_open_phone');
  }
};

export const openWhatsApp = (number?: string, errorMessageKey?: string) => {
  console.info(getLogMessage('openWhatsApp'), number);

  if (number && number.length) {
    open(
      `whatsapp://send?phone=${number}`,
      errorMessageKey || 'error_open_whats_app',
    );
  }
};

const open = async (url: string, errorMessageKey?: string) => {
  console.info(getLogMessage('open'), url);

  try {
    await Linking.openURL(url);
  } catch (error) {
    console.warn(getLogMessage(`Failed to open: ${url}`), error);

    toast?.show(
      translate(errorMessageKey ? errorMessageKey : 'error_processing_request'),
      {type: 'danger'},
    );
  }
};
