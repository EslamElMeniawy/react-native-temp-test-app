type ToastType = import('react-native-toast-notifications').ToastType | null;

declare global {
  const toast: ToastType;
}

declare var toast: ToastType;
