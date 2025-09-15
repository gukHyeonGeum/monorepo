export const useCloseBrowser = () => {
  const closeBrowser = (type: string) =>
    (
      window as Window &
        typeof globalThis & {
          webkit?: {
            messageHandlers?: {
              cordova_iab?: {
                postMessage: (message: string) => void;
              };
            };
          };
        }
    ).webkit?.messageHandlers?.cordova_iab?.postMessage(JSON.stringify({ type }));

  return closeBrowser;
};
