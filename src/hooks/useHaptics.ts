import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useHaptics = () => {
  const impact = async (style: ImpactStyle = ImpactStyle.Medium) => {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      // Haptics not available on web
      console.debug('Haptics not available');
    }
  };

  const notification = async (type: 'success' | 'warning' | 'error' = 'success') => {
    try {
      await Haptics.notification({ type: type.toUpperCase() as any });
    } catch (error) {
      console.debug('Haptics not available');
    }
  };

  const selectionStart = async () => {
    try {
      await Haptics.selectionStart();
    } catch (error) {
      console.debug('Haptics not available');
    }
  };

  const selectionChanged = async () => {
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      console.debug('Haptics not available');
    }
  };

  const selectionEnd = async () => {
    try {
      await Haptics.selectionEnd();
    } catch (error) {
      console.debug('Haptics not available');
    }
  };

  return {
    impact,
    notification,
    selectionStart,
    selectionChanged,
    selectionEnd,
  };
};
