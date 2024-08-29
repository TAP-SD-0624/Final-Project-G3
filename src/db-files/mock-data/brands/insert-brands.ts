/* eslint-disable */
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

let data = [
  { name: "Nike", imageName: "Nike.svg" },
  { name: "Adidas", imageName: "Adidas.png" },
  { name: "Louis Vuitton", imageName: "Louis Vuitton.png" },
  { name: "Gucci", imageName: "Gucci.png" },
  { name: "Chanel", imageName: "Chanel.png" },
  { name: "Zara", imageName: "Zara.png" },
  { name: "H&M", imageName: "H&M.png" },
  { name: "Clinique", imageName: "Clinique.png" },
  { name: "Estée Lauder", imageName: "Estee Lauder.svg" },
  { name: "Dior", imageName: "Dior.png" },
  { name: "Ralph Lauren", imageName: "Ralph Lauren.png" },
  { name: "L'Oréal", imageName: "L'Oréal.png" },
  { name: "Calvin Klein", imageName: "Calvin Klein.png" },
  { name: "Versace", imageName: "Versace.png" }
];
; 

async function uploadBrandImage() {
  try {
  const auth = await axios.post(
    'https://backend-final-g3-qngl.onrender.com/api/auth/login',
    {
      email: "sarazebdeh@gmail.com",
      password: "Sara@test1234"
    },
  );
  console.log(`Authentication status: ${auth.status}`);
  const token = auth.data.token;
  for (let i = 0; i < data.length; i++){
    let formData = new FormData();
    formData.append('name', data[i].name);
    formData.append('image', fs.createReadStream(`./src/db-files/mock-data/brands/assets/${data[i].imageName}`));
    const response = await axios.post(
      'https://backend-final-g3-qngl.onrender.com/api/brands',
      formData,
      {
        headers: {
          'authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          ...formData.getHeaders(), // This adds the necessary headers for the form data
        },
      }
    );
    console.log(`${data[i].name} uploaded successfully`);
  }
  } catch (error: any) {
    console.error(`Something wrong happened: ${error.message}`);
  }
}

uploadBrandImage();
