import {Linking} from 'react-native';

const getLogMessage = (message: string) => {
  return `## LinkingUtils: ${message}`;
};

export const openUrl = (url?: string) => {
  console.info(getLogMessage('openUrl'), url);

  if (url && url.length) {
    open(url);
  }
};

export const openEmail = (email?: string) => {
  console.info(getLogMessage('openEmail'), email);

  if (email && email.length) {
    open(`mailto:${email}`);
  }
};

export const openPhone = (phone?: string) => {
  console.info(getLogMessage('openPhone'), phone);

  if (phone && phone.length) {
    open(`tel:${phone}`);
  }
};

const open = async (url: string) => {
  console.info(getLogMessage('open'), url);

  try {
    await Linking.openURL(url);
  } catch (error) {
    console.warn(getLogMessage(`Failed to open: ${url}`), error);
  }
};
