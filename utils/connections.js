export const disconnect = async (payload = null) => {
  try {
    const disconnect = await fetch('/api/disconnect', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!disconnect.ok) {
      throw new Error(`Failed to Disconnect account: ${disconnect.statusText}`);
    }

    const response = await disconnect.json();
    return response;
  } catch (error) {
    console.log('this was the error from Mesh', error);
  }
};

export const refresh = async (payload = null) => {
  try {
    const refreshToken = await fetch('/api/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!refreshToken.ok) {
      throw new Error(
        `Failed to Disconnect account: ${refreshToken.statusText}`
      );
    }

    const response = await refreshToken.json();
    return response;
  } catch (error) {
    console.log('this was the error from Mesh', error);
  }
};
