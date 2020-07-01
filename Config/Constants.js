var supplierId = 59;

const staggingStoreManager =
  'http://ec2-3-7-159-160.ap-south-1.compute.amazonaws.com/';
const staggingAccountManager =
  'http://ec2-3-6-120-2.ap-south-1.compute.amazonaws.com/';

export const searchUrl =
  staggingStoreManager + 'api/v3/stores/products/tags/59?tags=';

export const fetchCategoriesUrl = () => {
  return staggingAccountManager + 'api/v3/suppliers/';
};

export const fetchSubCategoriesUrl = categoryId => {
  return (
    staggingStoreManager +
    'api/v3/stores/sub-categories/category/' +
    categoryId +
    '?currentPage=0&isHidden=1&itemPerPage=0&sortBy=position&sortOrder=%20asc'
  );
};
export const fetchSubSubCategoriesUrl = subCategoryId => {
  return (
    staggingStoreManager + 'api/v3/stores/categories/supplier/' + subCategoryId
  );
};

export const fetchSubCategoryProductsUrl = (pageNum, subCatId) => {
  return staggingStoreManager + '/api/v1/product/listing/supplier/' + subCatId;
};
export const fetchSubSubCategoryProductsUrl = (
  pageNumber,
  subCategoryId,
  subSubCategoryId,
) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/59?currentPage=' +
    pageNumber +
    '&id=0&isApp=1&isFeatured=0&itemPerPage=6&subCategoryId=' +
    subCategoryId +
    '&subSubCategoryId=' +
    subSubCategoryId +
    '&topCount=0'
  );
};

export const customerAddressesUrl = customerId => {
  return (
    staggingAccountManager +
    'api/v3/store/customer/address/customer/' +
    customerId +
    '?currentPage=0&itemPerPage=0'
  );
};

export const gioCoderApiKey = 'AIzaSyD-jQqFiTFbtheigXxNWd1-M8Utt59FrQ0';

export const uploadAddressUrl =
  staggingAccountManager + 'api/v3/store/customer/address/';

export const mainWalletBalance = customerId => {
  return staggingAccountManager + 'api/v3/account/wallet/amount/' + customerId;
};

export const promoWalletBalance = customerId => {
  return (
    staggingAccountManager + 'api/v3/account/wallet/promo/amount/' + customerId
  );
};

export const promoWalletAndMainWalletBalance = customerId => {
  return (
    staggingAccountManager +
    'api/v3/account/wallet/promo/and/wallet/amount/59/' +
    customerId
  );
};
export const getReferalCodeUrl = customerId => {
  return 'GET50';
};
export const createReferalCodeUrl = customerId => {
  return 'GET50';
};
export const userTransactionsInWallet = customerId => {
  return (
    staggingAccountManager +
    'api/v3/account/wallet/customer/' +
    customerId +
    '?currentPage=0&itemPerPage=0'
  );
};

export const deliveriblityCheckUrl = (lattitude, longitude) => {
  return (
    'http://ec2-35-154-211-17.ap-south-1.compute.amazonaws.com/api/v3/suppliers/check/delivery/59/' +
    lattitude +
    '/' +
    longitude
  );
};

export const getNearestStoreUrl = (supplierId, latitude, longitude) => {
  return (
    'http://ec2-35-154-211-17.ap-south-1.compute.amazonaws.com/api/v3/suppliers/' +
    supplierId +
    '/' +
    latitude +
    '/' +
    longitude
  );
};

export const userOrdersUrl = customerId => {
  return (
    'http://ec2-13-127-106-130.ap-south-1.compute.amazonaws.com/api/v3/store/cart/order/customer/' +
    customerId +
    '/' +
    supplierId +
    '?cancelled=1'
  );
};

// export const userOrdersUrl = customerId => {
//   return 'https://www.outsourcecto.com/api/v3/store/cart/order/customer/1/1?cancelled=1';
// };

export const updateuserProfileUrl = customerId => {
  return (
    'http://ec2-35-154-211-17.ap-south-1.compute.amazonaws.com/api/v3/customers/' +
    customerId
  );
};

export const getUserProfile = customerId => {
  return (
    'http://ec2-35-154-211-17.ap-south-1.compute.amazonaws.com/api/v3/customers/customer/' +
    customerId +
    '?currentPage=0&itemPerPage=0'
  );
};

export const otpVerificationUrl = () => {
  return 'http://ec2-13-234-237-49.ap-south-1.compute.amazonaws.com/oauth/token';
};

export const getProductByNameAndId = (productName, productId) => {
  return (
    'http://ec2-15-206-243-242.ap-south-1.compute.amazonaws.com/api/v3/stores/products/name/' +
    productName +
    '?currentPage=0&id=' +
    productId +
    '&isApp=1&isFeatured=0&itemPerPage=%200%20&%20topCount%20=%200'
  );
};

export const validatePhoneNumberUrl = (supplierID, phoneNumber) => {
  return (
    'http://ec2-13-234-237-49.ap-south-1.compute.amazonaws.com/api/v3/' +
    supplierID +
    '/otp/' +
    phoneNumber
  );
};

// export const validatePhoneNumberUrl = (supplierID, phoneNumber) => {
//   return (
//     'http://f2dcc930e003.ngrok.io/api/v3/' + supplierID + '/otp/' + phoneNumber
//   );
// };

BASE_URL = 'http://ec2-15-206-243-242.ap-south-1.compute.amazonaws.com';
