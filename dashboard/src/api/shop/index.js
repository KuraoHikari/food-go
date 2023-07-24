import axios from "axios";

export async function fetchShops(accessToken) {
  console.log("🚀 ~ file: index.js:4 ~ fetchShops ~ accessToken:", accessToken);
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_API_URL}/shop`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
}
