const axios = require("axios");

const getData = async () => {
  try {
    return await axios.get("https://dog.ceo/api/breeds/list/all");
  } catch (error) {
    console.error(error);
  }
};

getData();
