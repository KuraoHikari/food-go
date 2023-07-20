import axios from "axios";

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
    console.log(error);
    throw error; // Rethrow the error to be caught by the caller
  }
}

// Function to refresh the access token
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
    return data.access_token;
  } catch (error) {
    console.log("🚀 ~ handleLogout ~ error:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}
