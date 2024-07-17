const pako = require('pako');

export const GzDecompress=(encoded)=> {
  const encodedData = encoded;
  const compressedData = Buffer.from(encodedData, 'base64');

  // Decompress the data
  const decompressedData = pako.inflate(compressedData, { to: 'string' });

  return JSON.parse(decompressedData);
}

// module.exports = GzDecompress;
