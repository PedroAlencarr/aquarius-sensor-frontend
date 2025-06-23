const API_URL = process.env.REACT_APP_API_URL || "";
const API_KEY = process.env.REACT_APP_API_KEY || "";

export const fetchTemperatureData = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    throw error;
  }
};
