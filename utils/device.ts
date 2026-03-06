import DeviceInfo from 'react-native-device-info';

export const getDeviceFingerprint = async () => {

  const uniqueId = await DeviceInfo.getUniqueId();
  const deviceId = DeviceInfo.getDeviceId();
  const buildId = await DeviceInfo.getBuildId();
  
  // Combine into a hash
  const fingerprint = `${uniqueId}-${deviceId}-${buildId}`;
  return fingerprint;
};