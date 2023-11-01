export const findNetworkId = (data, targetType, targetName) => {
  console.log('findNeetworks function: ', data, targetType, targetName);
  for (const item of data) {
    if (item.type?.toLowerCase() === targetType?.toLowerCase()) {
      for (const network of item.networks) {
        if (network.name.toLowerCase() === targetName?.toLowerCase()) {
          return network.id;
        }
      }
    }
  }
  return null; // Return null if no matching network id is found
};
