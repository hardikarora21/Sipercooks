startRazorpay = clubbedPayment => {
  var walletAmount = this.state.Wallet_Data;
  if (clubbedPayment == 1) {
    var newAmount = finalOrderAmount - walletAmount;
    // newAmount = newAmount.toFixed(2)
    newAmount = Math.round(newAmount * 100) / 100;

    newAmount = newAmount * 100;
    var options = {
      description: 'Payment For Order',
      image: 'https://i.ibb.co/z8vLzxB/asdfa.jpg',
      currency: 'INR',
      key: 'rzp_live_SOgPs8jiYRFTOw',
      amount: newAmount,
      name: 'NEEDS Market',
      Theme: {color: '#F30'},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        alert(`Success: ${data.razorpay_payment_id}`);
        this.removeBalanceFromWallet(walletAmount);
      })
      .catch(error => {
        // handle failure
        // console.log('error', error);
        alert(`Error: ${error.code} | ${error.description}`);
        this.setState({placeOrderModal: false});
      });
  } else {
    var newAmount = finalOrderAmount;
    newAmount = Math.round(newAmount * 100) / 100;
    newAmount = newAmount * 100;
    var options = {
      description: 'Payment For Order',
      image: 'https://i.ibb.co/z8vLzxB/asdfa.jpg',
      currency: 'INR',
      key: 'rzp_live_SOgPs8jiYRFTOw',
      amount: newAmount,
      name: 'NEEDS Market',
      Theme: {color: '#F30'},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        alert(`Success: ${data.razorpay_payment_id}`);
        this.sendOrderDataToServer(0);
      })
      .catch(error => {
        // handle failure
        // console.log('error', error);
        alert(`Error: ${error.code} | ${error.description}`);
      });
  }
};
removeBalanceFromPromoWallet = async debitedAmount => {
  var url = Config.API_LOGIN + '/api/v3/account/wallet/promo/wallet/';
  const authSingleton = new AuthSingleton();
  const authToken = authSingleton.getAuthToken();
  const userId = authSingleton.getUserId();
  data = {
    accountingEntryType: 'DEBIT',
    customer: userId,
    userRequestAmount: debitedAmount,
    supplier: Config.SUPPLIER_ID,
  };
  console.log('Url and param', url, data);
  Axios.post(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      console.log('Recharge Wallet to the Server', response);
    })
    .catch(function(error) {
      console.log(error);
    });
};

removeBalanceFromWallet = async debitedAmount => {
  var url = Config.API_LOGIN + '/api/v3/account/wallet/';
  const authSingleton = new AuthSingleton();
  const authToken = authSingleton.getAuthToken();
  const userId = authSingleton.getUserId();
  data = {
    accountingEntryType: 'DEBIT',
    customer: userId,
    userRequestAmount: debitedAmount,
    supplier: Config.SUPPLIER_ID,
  };
  console.log('Url and param', url, data);
  Axios.post(url, data, {
    headers: {
      Authorization: 'Bearer ' + authToken,
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      console.log('Recharge Wallet to the Server', response);
      this.sendOrderDataToServer(0);
    })
    .catch(function(error) {
      console.log(error);
    });
};

sendOrderDataToServer = async clubbedPayment => {
  this.setState({isLoading: true});
  var url = Config.BASE_URL + '/api/v3/store/cart';
  if (promoUsedBal > 0) {
    await this.removeBalanceFromPromoWallet(promoUsedBal);
  }
  if (clubbedPayment == 1) {
    finalOrderAmount = finalOrderAmount - walletBalance;
  } else {
    if (paymentType == 'ONLINE') {
      walletBalance = 0;
    } else if (paymentType == 'wallet') {
      walletBalance = finalOrderAmount;
    } else if (paymentType == 'cod') {
      walletBalance = 0;
    }
  }

  const authSingleton = new AuthSingleton();
  authSingleton.loadAuthToken();
  const authToken = authSingleton.getAuthToken();
  const userId = authSingleton.getUserId();
  var vendorId = authSingleton.getVendorId();

  finalOrderAmount = parseInt(finalOrderAmount, 10);
  walletBalance = parseInt(walletBalance, 10);

  const CartObject = realm.objects('needsCart');
  let CartArray = Array.from(CartObject);
  var requiredDate =
    this.state.selectedDate.name +
    ' ' +
    this.state.selectedDate.month +
    ' ' +
    this.state.selectedDate.id +
    ' ' +
    this.state.selectedDate.year +
    ' 00:00:00';
  requiredDate = new Date(requiredDate);
  var body = {
    cartProductRequests: CartArray,
    paymentMode: paymentType,
    promoWallet: promoUsedBal,
    mainWallet: 0,
    convenienceFee: this.state.homeDelivery ? convinenceCharge : deliveryCost,
    deliveryCharges: this.state.selfPickup ? convinenceCharge : deliveryCost,
    orderAmount: finalOrderAmount,
    supplier: vendorId,
    couponDiscount: 0.0,
    deliveryType: this.state.selfPickup ? 'SELF-PICKUP' : 'HOME-DELIVERY',
    requiredDate: requiredDate,
    requiredTimeString: this.state.selectedSlot.time,
    customer: userId,
    message: this.state.orderSpecialInstruction,
    orderFrom: Platform.OS === 'ios' ? 'ios' : 'android',
    society: this.state.ADDRESS_Data.landmark,
    addresses: [
      {
        addressLine1: this.state.ADDRESS_Data.addressLine1,
        addressLine2: this.state.ADDRESS_Data.addressLine2,
        addressState: this.state.ADDRESS_Data.addressState,
        city: this.state.ADDRESS_Data.city,
        country: this.state.ADDRESS_Data.city,
        customerId: userId,
        customerName: this.state.ProfileData.firstName
          ? this.state.ProfileData.firstName
          : this.state.ProfileData.phoneNo,
        contactNo: this.state.ProfileData.phoneNo,
        landmark: this.state.ADDRESS_Data.landmark,
        latitude: this.state.ADDRESS_Data.latitude,
        longitude: this.state.ADDRESS_Data.longitude,
        pincode: this.state.ADDRESS_Data.pincode,
      },
    ],
  };
  console.log('walletRemove body', body);
  try {
    const response = await Axios.post(url, body, {
      headers: {
        Authorization: 'Bearer ' + authToken,
        'Content-Type': 'application/json',
      },
    });
    console.log('TRY CATCH CARTID', response, finalOrderAmount);
    // cartId = 3;
    this.orderPlacedSucessfully(response, finalOrderAmount);
  } catch (error) {
    console.log('error', error);
    this.setState({
      isLoading: false,
      placeOrderModal: false,
    });
  }
};
