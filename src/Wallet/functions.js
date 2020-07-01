getMainWalletBallance = async customerId => {
  this.setState({isMainWalletLoading: true});

  var url = mainWalletBalance(customerId);

  await Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      console.log('Wallet data->', response.data.object[0]);
      // [0].balancePont
      this.setState({
        mainWalletData: response.data.object,
        isMainWalletLoading: false,
      });
    })
    .catch(error => {
      this.setState({isMainWalletLoading: false});
      console.log('Error', error.message);
    });
};

getPromoWalletBalance = async customerId => {
  this.setState({isMainWalletLoading: true});

  var url = promoWalletBalance(customerId);

  await Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      console.log('Promo Wallet data->', response.data.object);
      // [0].balancePont
      this.setState({
        promoWalletData: response.data.object,
        isPromoWalletLoading: false,
      });
    })
    .catch(error => {
      this.setState({isPromoWalletLoading: false});
      console.log('Error', error.message);
    });
};
