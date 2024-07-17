//api.js
const token = localStorage.getItem('qrg:access-token');
const baseURL = 'http://localhost:3003'; 
const sisURL = 'https://qrg.sis.scieverinc.com';

export const generateQRCode = async (qrData) => {
  try {
    const response = await fetch(`${baseURL}/qrcode/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(qrData),
    });
    const responseData = await response.json();
    if (response.ok) {
      return responseData.qrCodeData; // Extract the QR code data from the response
    } else {
      throw new Error(responseData.message || 'Failed to generate QR code');
    }
  } catch (error) {
    throw error;
  }
};

export const generateVQRCode = async (qrData) => {
  try {
    const response = await fetch(`${baseURL}/qrcode/generatev`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(qrData),
    });
    const responseData = await response.json();
    if (response.ok) {
      return responseData.qrCodeData; // Extract the QR code data from the response
    } else {
      throw new Error(responseData.message || 'Failed to generate QR code');
    }
  } catch (error) {
    throw error;
  }
};

export const getQRCodes = async (userId) => {
  try {
    const response = await fetch(`${baseURL}/qrcode/get/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch QR codes');
    }
    const data = await response.json();
    return data.response || []; // Return the array of QR codes or an empty array
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of an error
  }
};

export const getAllQRCodes = async (token) => {
  try {
    const response = await fetch(`${baseURL}/qrcode/getAllQrs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        // 'user-role': encryptedUserRole, // Replace with actual encrypted role
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch all QR codes');
    }
    const data = await response.json();
    return data.allQRCodes || []; // Return the array of all QR codes or an empty array
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of an error
  }
};



export const getUserdata = async (token) => {
  try {
    const response = await fetch(`${sisURL}/api/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteQRCode = async (qrId,qrType) => {
  try {
    let response;
    if (qrType === 'QRCode') {
       response = await fetch(`${baseURL}/qrcode/delete/${qrId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });
    }
    else if (qrType === 'VQRCode') {
      response = await fetch(`${baseURL}/qrcode/deletev/${qrId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    }
      const data = await response.json();
      return data; // Return the response data
  } catch (error) {
      throw error;
  }
};
export const updateQRCode = async (qrId, updatedData, qrType) => {
  try {
    let response;
    if (qrType === 'QRCode') {
      response = await fetch(`${baseURL}/qrcode/update/${qrId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
    } else if (qrType === 'VQRCode') {
      response = await fetch(`${baseURL}/qrcode/updatev/${qrId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
    } else {
      throw new Error('Invalid QR code type');
    }

    const data = await response.json();
    if (response.ok) {
      return data; // Return the updated data
    } else {
      throw new Error(data.message || 'Failed to update QR code');
    }
  } catch (error) {
    throw error;
  }
};

export const fetchQRCodeById = async (qrId, qrType) => {
  console.log(qrId, qrType)
  try {
    let response

    if (qrType === 'QRCode') {
     response = await fetch(`${baseURL}/qrcode/getById/${qrId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  } 
  else if (qrType === 'VQRCode') {
     response = await fetch(`${baseURL}/qrcode/getByVId/${qrId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  }

    if (!response.ok) {
      throw new Error('Failed to fetch QR code data');
    }
    const data = await response.json();
    return data.qrCodeData || {}; // Return the QR code data or an empty object
  } catch (error) {
    console.error(error);
    throw error;
  }
};

