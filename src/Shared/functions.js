export function createStringWithFirstLetterCapital(string) {
  var capitalisedArr = string
    .toLowerCase()
    .split(' ')
    .map((item, index) => {
      return item.charAt(0).toUpperCase() + item.slice(1);
    });
  return capitalisedArr.join(' ');
}

export function createStringWithAllLettersCapital(string) {
  var strArr = string.split('');
  var capitalisedArr = [];
  strArr.map((item, index) => {
    capitalisedArr.push(item.toUpperCase());
  });
  return capitalisedArr.join('');
}

export function getDate(date) {
  console.log('New date', date);
  var newDate = String;
  newDate = date;
  if (date != undefined && date != null) {
    newDate = newDate.split('-');
    var myDate =
      newDate[2][0] +
      newDate[2][1] +
      ' ' +
      getMonth(newDate[1]) +
      ' ' +
      newDate[0];
    return myDate;
  }
}
export function getMonthForCheckout(num) {
  if (num == 0) {
    return 'Jan';
  } else if (num == 1) {
    return 'Feb';
  } else if (num == 2) {
    return 'March';
  } else if (num == 3) {
    return 'April';
  } else if (num == 4) {
    return 'May';
  } else if (num == 5) {
    return 'June';
  } else if (num == 6) {
    return 'July';
  } else if (num == 7) {
    return 'Aug';
  } else if (num == 8) {
    return 'Sep';
  } else if (num == 9) {
    return 'Oct';
  } else if (num == 10) {
    return 'Nov';
  } else if (num == 11) {
    return 'Dec';
  }
}

export function getMonth(num) {
  if (num === 1) {
    return 'Jan';
  } else if (num == 2) {
    return 'Feb';
  } else if (num == 3) {
    return 'March';
  } else if (num == 4) {
    return 'April';
  } else if (num == 5) {
    return 'May';
  } else if (num == 6) {
    return 'June';
  } else if (num == 7) {
    return 'July';
  } else if (num == 8) {
    return 'Aug';
  } else if (num == 9) {
    return 'Sep';
  } else if (num == 10) {
    return 'Oct';
  } else if (num == 11) {
    return 'Nov';
  } else if (num == 12) {
    return 'Dec';
  }
}

export function getDay(num) {
  if (num === 0) return 'SUN';
  if (num === 1) return 'MON';
  if (num === 2) return 'TUE';
  if (num === 3) return 'WED';
  if (num === 4) return 'THU';
  if (num === 5) return 'FRI';
  if (num === 6) return 'SAT';
}

export function getCurrentTimeinHours() {
  var currentdate = new Date();
  var datetime =
    'Last Sync: ' +
    currentdate.getDate() +
    '/' +
    (currentdate.getMonth() + 1) +
    '/' +
    currentdate.getFullYear() +
    ' @ ' +
    currentdate.getHours() +
    ':' +
    currentdate.getMinutes() +
    ':' +
    currentdate.getSeconds();

  // datetime stores this value 'Last Sync: 25/6/2020 @ 19:8:48'

  var currentHour = currentdate.getHours();
  return currentHour;
}

export function getDateAndTime(firestoreTimestamp) {
  var UTCDate = firestoreTimestamp.toDate();
  var dateAndTime =
    UTCDate.getFullYear() +
    '-' +
    (UTCDate.getMonth() + 1) +
    '-' +
    UTCDate.getDate();
  return dateAndTime;
}

export function findCartTotal(cart) {
  var total = 0;
  cart.map((item, index) => {
    total += item.productListings[0].sellingPrice * item.productCountInCart;
  });
  return total;
}
