'use strict';

/* --------------------------------------- */
/* Utility functions                       */
/* --------------------------------------- */
function listen(event, selector, callback) {
  return selector.addEventListener(event, callback);
}

function select(selector) {
  return document.querySelector(selector);
}


/* --------------------------------------- */
/* Alarm clock                             */
/* --------------------------------------- */
const time = select('.time-display');
const alarm = select('span');
const hours = select('.hours');
const minutes = select('.minutes');
const setButton = select('.set-button');
const future = new Date();
let presentTime = null;
let ready = false;

//Reset time in input-fields upon reloading the page
function resetAlarmTime() {
  hours.value = '';
  minutes.value = '';
}

listen('load', window, () => {
  resetAlarmTime();
});

// Making sure the number of digits are '2'
function checkNumbers(number) {
  return number.toString().padStart(2, '0'); 
};

// Displaying current time
const options = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}

function displayTime() {
  let lastTime = 0;
  const render = presentTime => {
    if (lastTime === 0 || presentTime - lastTime >= 1000) {
      lastTime = presentTime;
      time.innerText = new Date().toLocaleTimeString('en-ca', options);
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
displayTime();

// Comparing times for alarm
const audio = new Audio('./assets/audio/alarm.mp3');
audio.type = 'audio/mp3';

function compare(one, two) {
  let clockTime = `${one.getHours()}${one.getMinutes()}${one.getSeconds()}`;
  let alarmTime = `${two.getHours()}${two.getMinutes()}${two.getSeconds()}`;

  if (clockTime === alarmTime) {
    time.classList.add('highlight');
    audio.play();
    ready = false;
    setTimeout(() => { time.classList.remove('highlight'); }, 34000);
  }
}

setInterval(() => {
  presentTime = new Date();
  if (ready) compare(presentTime, future);
}, 1000);

// Validating time and all inpits
listen('input', time, () => {
  let hour = time.value.trim();
  if (hour.length === 2) {
    time.value = `${hour}:`;
  }
});

listen('input', hours, () => {
  let regex = /^\d+$/;
  let input = hours.value.trim();
  if (!regex.test(input)) hours.value = '';
});

listen('input', minutes, () => {
  let regex = /^\d+$/;
  let input = minutes.value.trim();
  if (!regex.test(input)) minutes.value = '';
});

function isvalid(i, l, e) {                                         // Got this function online
  if (i.length === 2 && parseInt(i) >= 0 && parseInt(i) <= l) {
    return true;
  }

  e.focus();
  return false;
}

//Sets the alarm and reset time in input-fields afterwards
listen('click', setButton, () => {
  let numHour = hours.value;
  let numMinute = minutes.value;

  if (isvalid(numHour, 23, hours) && isvalid(numMinute, 59, minutes)) {
    alarm.innerText = `${numHour}:${numMinute}`;
    future.setHours(numHour);
    future.setMinutes(numMinute);
    future.setSeconds(0);
    ready = true;
    resetAlarmTime();
  }
});