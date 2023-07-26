import axios from "axios";

export async function fetchShops(accessToken) {
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

export async function createShop(payload) {
  const formData = new FormData();

  formData.append("logo", payload.file[0]);
  formData.append("name", payload.name);
  formData.append("location", payload.location);
  formData.append("desc", payload.desc);
  formData.append("phoneNumber", payload.phoneNumber);

  try {
    const { data } = await axios({
      method: "post",
      url: `${import.meta.env.VITE_BASE_API_URL}/shop`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: formData,
    });

    return data;
  } catch (error) {
    throw error;
  }
}
