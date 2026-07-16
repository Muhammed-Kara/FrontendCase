import axios from 'axios';

export const fetchInitialProducts = async () => {
  try {
   
    const response = await axios.get('https://dummyjson.com/products?limit=200');
    return response.data.products;
  } catch (error) {
    console.error('Ürünler çekilirken hata oluştu:', error);
    return [];
  }
};