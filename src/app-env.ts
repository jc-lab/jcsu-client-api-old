const trueValues = [
  '1', 'true', 'yes'
];
const falseValues = [
  '0', 'false', 'no'
];

function envCheckBoolean(envValue: string | undefined, defaultValue: boolean): boolean {
  if (envValue) {
    const lowerValue = envValue.toLowerCase();
    if (defaultValue) {
      if (falseValues.includes(lowerValue)) {
        return false;
      }
    } else {
      if (trueValues.includes(lowerValue)) {
        return true;
      }
    }
    return trueValues.includes(lowerValue);
  }
  return defaultValue;
}

export const PORT = parseInt(process.env.PORT || '8080');

export const STORAGE_BUCKET_NAME = process.env.STORAGE_BUCKET_NAME || 'jcsu-update-assets';

export const APP_USE_PROXYED_DOWNLOAD = envCheckBoolean(process.env.APP_USE_PROXYED_DOWNLOAD, false);
export const APP_PROXYED_URL = process.env.APP_PROXYED_URL;
