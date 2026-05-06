const PRODUCT_API_URL = "https://script.google.com/macros/s/AKfycbyQkD_zd3vZx8s0PdSFrfPEdED8YMwawqhnc-WCcssR6thRuLeD6ip7Ukx9uZ-_JY8evA/exec";

export async function findProductById(barcode,branch) {
  const url = `${PRODUCT_API_URL}?action=findProduct&barcode=${barcode}&branch=${encodeURIComponent(branch)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.success) return null;

  return {
    name: data.name,
  };
}

export async function getAllProducts(branch){
  const url =`${PRODUCT_API_URL}?action=getAllProduct&branch=${encodeURIComponent(branch)}`;

  const res = await fetch(url);
  const data = await res.json();

  return data
}