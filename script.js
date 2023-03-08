'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-02-10T17:01:17.194Z',
    '2023-02-27T17:01:17.929Z',
    '2023-02-28T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date, locale) {
  const calcDayspass = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDayspass(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) {
    return 'Today';
  }
  if (daysPassed === 1) {
    return 'Yesterday';
  }
  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  }
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0); // month start from zero index
  // const year = date.getFullYear();

  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);

  // console.log(date);
};

// formated Currency function
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    console.log(date);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  // set Time to 5 minutes
  let time = 120;
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    // In each call print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    time--;
    // When 0 seconds ,stop Timer and logout user
    if (time === -1) {
      clearInterval(time);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
  };
  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// // Fake Always Logged in
// currentAccount = account1;
// updateUI(account1);
// containerApp.style.opacity = 100;

//Login Button
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //  Create current date and time
    const now = new Date();
    // / Experimenting API
    // const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    const locale = navigator.language;
    console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale
    ).format(now);
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0); // month start from zero index
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${date}/${month}/${year},${hour}:${min}`;
    // console.log();
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});
// Transfer Button
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// Loan button
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
});

// close button
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

// Converting a string to number

console.log(Number('23'));
console.log(+'23');

// Parsing

console.log(Number.parseInt('70px', 10));
console.log(Number.parseInt('px70', 10));

console.log(Number.parseFloat('7.9em'));
console.log(Number.parseInt('7.9em'));

// console.log(parseInt('7.9em'));
// console.log(parseFloat('7.9em'));

// Check the value is not a number
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20x'));

// checking if value is number
console.log('isFinite');
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20px'));

console.log('isIntger');
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));

// Math function

// Square root of number
console.log(Math.sqrt(25));

// or
console.log(25 ** (1 / 2));

console.log(Math.max(5, 10, 21));
console.log(Math.min(2, 3, 11, 8));

console.log(Math.PI);

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;

console.log(randomInt(5, 10));

// Rounding integer
console.log('Math.trunc');
console.log(Math.trunc(23.3));

console.log('Math.round');
console.log(Math.round(23.3));
console.log(Math.round(23.9));
console.log(Math.round(23.5));

console.log('Math.ceil');
console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log('Math.floor');
console.log(Math.floor(23.3));
console.log(Math.floor(23.9));

console.log('Difference between trunc and floor');
console.log(Math.floor(-23.7));
console.log(Math.trunc(-23.7));

// Rounding Decimals
console.log('Rounding Decimals');
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(2));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.365).toFixed(1));

console.log('Divider Operator');
console.log(5 % 2);
console.log(5 / 2);

const isEven = n => n % 2 === 0;

console.log(isEven(24));
console.log(isEven(1245));
console.log(isEven(2));

labelBalance.addEventListener('click', function () {
  console.log('clcik1');
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) {
      row.style.backgroundColor = 'orangered';
    }
    if (i % 3 === 0) {
      row.style.backgroundColor = 'blue';
    }
  });
});

// Numeric Separator

const diameter = 287_460_000_000;
console.log(diameter);

const transfer1 = 15_00;
const transfer2 = 1_500;

// BigInt

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);

// Example of BigInt

console.log(29878587834928309149127491378274282746827);
console.log(29878587834928309149127491378274282746827n);
console.log(BigInt(29878587834928309149127491378274282746827));

// Exception
console.log(20n > 20);

const huge = 20123455742313414n;
console.log(`The value of ${huge} is high`);

// Date in Js
// Create a Date
const now = new Date();
console.log(now);

console.log('Sun Jan 12 2023 16:27:53');
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2000, 8, 23, 4, 32, 0));
console.log(new Date(2000, 8, 32));
// console.log(new Date());
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));
*/
// Working with date
// const future = new Date(2037, 8, 23, 15, 23, 0);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());

// console.log(future.toISOString());

// // TimeStamp
// console.log(future.getTime());
// console.log(new Date(2137312380000));
// console.log(Date.now());
// console.log(new Date(1676201922825));

// Operation on Date

// console.log('Here');
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);
// console.log(future);

// const calcDayspass = (date1, date2) =>
//   Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);

// const day1 = calcDayspass(new Date(2037, 3, 4), new Date(2037, 3, 14));
// console.log(day1);

// Formating Numbers Using Intl

const num = 3884764.23;
const options = {
  style: 'currency',
  unit: 'mile-per-hour',
  currency: 'INR',
};
console.log('US:', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);

// SetTimer
// setTimeout(() => console.log('Here is your Pizza 🍕'), 1000);
// console.log('Waiting...');

const ingredients = ['mushroom', 'cheese'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}🍕`),
  3000,
  ...ingredients
);
console.log('Waiting...');
if (ingredients.includes('chicken')) clearTimeout(pizzaTimer);

// setInterval
setInterval(function () {
  const now = new Date();
  console.log(`${now.getHours}/${now.getMinutes}/${now.getSeconds}`);
}, 100000);
