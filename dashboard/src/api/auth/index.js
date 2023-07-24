import axios from "axios";

export async function loginUser(payload) {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_API_URL}/auth/local/signin`,
      {
        email: payload.email,
        password: payload.password,
      }
    );

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  } catch (error) {
    throw error;
  }
}

export async function registerUser(payload) {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_API_URL}/auth/local/signup`,
      {
        email: payload.email,
        password: payload.password,
      }
    );

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  } catch (error) {
    throw error;
  }
}

export async function logoutUser(accessToken) {
  try {
    await axios.post(
      `${import.meta.env.VITE_BASE_API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
}

export async function refreshAccessToken(refreshToken) {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_API_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  } catch (error) {
    throw error;
  }
}
