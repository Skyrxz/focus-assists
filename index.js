import { Twix } from './twix.js';
import { updateProgressBars } from './progress-bar.js';

const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
let minutesToComplete = Number(minutesInput.value);
let hoursToComplete = Number(hoursInput.value);
let amountOfBreaks = 0;
let completeIntervalSeconds = 0;
let completeIntervals = 0;
let breakSeconds = 0;
let updatableIntervalSeconds = 0;
let updatableBreakIntervalSeconds = 0;
let completeSeconds = 0;
let completedSecondsDaily = getCookie('completedSecondsDaily') ? getCookie('completedSecondsDaily') : 0 ;
let completedSecondsWeekly = getCookie('completedSecondsWeekly') ? getCookie('completedSecondsWeekly') : 0 ;
let completedSecondsMonthly = getCookie('completedSecondsMonthly') ? getCookie('completedSecondsMonthly') : 0 ;
let totalCompletedSeconds = localStorage.getItem('totalCompletedSeconds') ? localStorage.getItem('totalCompletedSeconds') : 0 ;

let longBreak = false;
let breakActive = false;
let paused = false;
let allowNotifications = true;
let allowSound = true;

// DOM ELEMENTS
const startBtnEl = document.getElementById('start');
const stopBtnEl = document.getElementById('stop');
const pauseBtnEl = document.getElementById('pause');
const reportsBtnEl = document.getElementById('reports-btn');
const settingsBtnEl = document.getElementById('settings-btn');
const reportsModalEl = document.getElementById('reports-modal');
const settingsModalEl = document.getElementById('settings-modal');
const reportsModalCloseBtnEl = document.getElementById('reports-modal-close-btn');
const settingsModalCloseBtnEl = document.getElementById('settings-modal-close-btn');
const modalsEl = document.getElementById('modals');
const inputContainerEl = document.getElementById('input-container');
const timerEl = document.getElementById('timer');
const infoEl = document.getElementById('info');
const breakTypeEl = document.getElementById('break-type');
const notificationStatusEl = document.getElementById('notification-status');
const soundStatusEl = document.getElementById('sound-status');
const openInWindowEl = document.getElementById('open-in-window');
const timerCircleEl = document.getElementById('timer-circle');
const timerContainerEl = document.getElementById('timer-container');
const statusEl = document.getElementById('status');
const completedTimeDailyEl = document.getElementById('completed-time-daily');
const completedTimeWeeklyEl = document.getElementById('completed-time-weekly');
const completedTimeMonthlyEl = document.getElementById('completed-time-monthly');
const totalCompletedTimeEl = document.getElementById('total-completed-time');
const nextStatusEl = document.getElementById('next-status');
const toggleEls = Array.from(document.querySelectorAll('.toggle'))

minutesInput.value = 35;
hoursInput.value = '00';

let clock = null;

Notification.requestPermission();

document.addEventListener('keypress', handleKeyPress)

function handleKeyPress(e) {
    if (e.target.dataset.input) {
        if (e.target.value < 0) {
            e.preventDefault();
            e.target.value = 0;
        }
        if (e.target.value > 5 && e.code.includes('Digit')) {
            e.preventDefault();
            e.target.value = 59;
        }
    }
    if (e.key === 'Enter') {
        if (e.target === stopBtnEl) {
            stopTimer();
        }
        if (e.target === pauseBtnEl) {
            pauseTimer();
        }
        if (e.target === startBtnEl) {
            showInputModule();
        }
    }
}

function updateToggle() {
    toggleEls.forEach(elem => {
        if (elem.value === '1')
            elem.classList.add('toggled')
        else
            elem.classList.remove('toggled')
    }
)}

document.addEventListener('click', e => {
    handleSettingsClick(e)
    if (e.target.classList.contains('toggle')) {
        e.target.addEventListener('mousedown', (e) => e.preventDefault());
        e.target.value = e.target.value === '1' ? '0' : '1';
        updateToggle()
    }
    if (e.target.dataset.input) {
        if (e.target.value < 0) {
            e.preventDefault();
            e.target.value = 0;
        } else if (e.target.value > 59) {
            e.preventDefault();
            e.target.value = 59;
        }
    }
})

startBtnEl.addEventListener('click', startTimer)
stopBtnEl.addEventListener('click', stopTimer);
pauseBtnEl.addEventListener('click', pauseTimer)
reportsBtnEl.addEventListener('click', showReportModal)
settingsBtnEl.addEventListener('click', showSettingsModal)
reportsModalCloseBtnEl.addEventListener('click', hideReportModal)
settingsModalCloseBtnEl.addEventListener('click', hideSettingsModal)
openInWindowEl.addEventListener('click', openInWindow)

function showModal(modalEl) {
    modalsEl.classList.remove('hidden')
    modalEl.classList.remove('hidden')
    modalEl.animate([{}, {
        opacity: 1,
        transform: 'none'
    }], {duration: 600, fill: 'forwards', easing: 'cubic-bezier(0.42, 0, 0.58, 1)'})
}

function hideModal(modalEl) {
    modalEl.animate([{}, {
        opacity: 0,
        transform: 'translateY(-1.75rem)'
    }], {duration: 300, fill: 'forwards', easing: 'cubic-bezier(0.42, 0, 0.58, 1)'})
    setTimeout(() => {modalsEl.classList.add('hidden'); modalEl.classList.add('hidden');}, 300)
}

function showReportModal() {
    showModal(reportsModalEl)
}

function showSettingsModal() {
    showModal(settingsModalEl)
}

function hideSettingsModal() {
    hideModal(settingsModalEl)
}

function hideReportModal() {
    hideModal(reportsModalEl)
}

function openInWindow() {
    window.open(
    `${window.location.href}`, 
    'newwindow', 
    'width=1280,height=720'
    ); 
}

function onGoingStyling() {
    pauseBtnEl.style.background = 'white';
}

function normalStyling() {
    pauseBtnEl.style.background = 'white';
}

function pausedStyling() {
    pauseBtnEl.style.background = 'orange';
}

function startedState() {
    if(amountOfBreaks > 0){statusEl.style.display = 'block';}
    startBtnEl.style.display = 'none';
    pauseBtnEl.style.display = 'flex';
    stopBtnEl.style.display = 'flex';
    infoEl.style.display = 'none';
    inputContainerEl.style.display = 'none';
    timerContainerEl.style.display = 'flex';
}

function normalState() {
    statusEl.style.display = 'none'
    startBtnEl.style.display = 'flex';
    pauseBtnEl.style.display = 'none';
    inputContainerEl.style.display = 'flex';
    stopBtnEl.style.display = 'none';
    timerContainerEl.style.display = 'none';
    infoEl.style.display = 'flex';
    updateTimerBar(1, 1);
}

function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

    function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}

function startTimer() {
    normalState();
    normalStyling();
    minutesToComplete = parseInt(minutesInput.value);
    hoursToComplete = parseInt(hoursInput.value);
    completeSeconds = hoursToComplete * 60 * 60 + minutesToComplete * 60;
    if (completeSeconds < 1) return;
    amountOfBreaks = Math.floor(completeSeconds / (25 * 60));
    completeIntervals = amountOfBreaks + 1;
    completeIntervalSeconds = completeSeconds / completeIntervals;
    updatableIntervalSeconds = completeIntervalSeconds;
    breakSeconds = longBreak === false ? 5 * 60 : 15 * 60;
    updatableBreakIntervalSeconds = breakSeconds;
    updateTime();
    clock = setInterval(updateTime, 1000);

    startedState();
}

function pauseTimer() {
    if (paused) {
        onGoingStyling();
        pauseBtnEl.innerHTML = '<i class="fa-solid fa-circle-pause"></i>Pause';
        paused = false;
        clock = setInterval(updateTime, 1000);
    } else {
        pausedStyling();
        paused = true;
        pauseBtnEl.innerHTML = '<i class="fa-solid fa-circle-play"></i>Resume';
        clearInterval(clock);
    }
}

function stopTimer() {
    clearInterval(clock);
    normalState();
    normalStyling();
    amountOfBreaks = 0;
    completeIntervalSeconds = 0;
    completeIntervals = 0;
    breakSeconds = 0;
    updatableIntervalSeconds = 0;
    updatableBreakIntervalSeconds = 0;
    completeSeconds = 0;
    breakActive = false;
    paused = false;
}

function updateIntervalTime() {
    onGoingStyling();
    const updatedTime = Twix.seperateSecondsToTime(updatableIntervalSeconds, true);
    updatableIntervalSeconds--;
    nextStatusEl.innerText = 'Focus Session'
    if (updatableIntervalSeconds < 1) {
        if (completeIntervals > 1) {
            playDing();
        }
        breakActive = true;
        completeIntervals--;
        updatableBreakIntervalSeconds = breakSeconds;
    }
    return updatedTime;
}

function handleSettingsClick(e) {
    if (e.target === breakTypeEl) {
        if(breakTypeEl.value == 1) {
            longBreak = false
        } else {
            longBreak = true
        }
        localStorage.setItem('break-type', longBreak)
    }

    if (e.target === notificationStatusEl) {
        if(notificationStatusEl.value == 1) {
            allowNotifications = false
        } else {
            allowNotifications = true
        }
        localStorage.setItem('notifications-status', allowNotifications)
    }

    if (e.target === soundStatusEl) {
        if(soundStatusEl.value == 1) {
            allowSound = false
        } else {
            allowSound = true
        }
        localStorage.setItem('sound-status', allowSound)
    }
}

function updateSettings() {
    longBreak = JSON.parse(localStorage.getItem('break-type')) === true;
    allowNotifications = JSON.parse(localStorage.getItem('notifications-status')) !== false;
    allowSound = JSON.parse(localStorage.getItem('sound-status')) !== false;

    if (longBreak) {
        breakTypeEl.value = '1';
    } else {
        breakTypeEl.value = '0';
    }

    if (allowNotifications) {
        notificationStatusEl.value = '1';
    } else {
        notificationStatusEl.value = '0';
    }

    if (allowSound) {
        soundStatusEl.value = '1';
    } else {
        soundStatusEl.value = '0';
    }

    updateToggle()
}

function updateBreakTime() {
    const updatedTime = Twix.seperateSecondsToTime(updatableBreakIntervalSeconds, true);
    updatableBreakIntervalSeconds--;
    nextStatusEl.innerText = 'Break';
    if (updatableBreakIntervalSeconds === 0) {
        playDing();
        breakActive = false;
        amountOfBreaks--;
        updatableIntervalSeconds = completeIntervalSeconds;
    }
    return updatedTime;
}

function updateTime() {
    if (amountOfBreaks === 0 && completeIntervals === 0) {
        stopTimer();
        playAlarm();
        sendEndNotification();
    }

    if (!breakActive && completeIntervals >= 1) {
        updateTimerBar(completeIntervalSeconds, updatableIntervalSeconds);
        const { hours, minutes, seconds } = updateIntervalTime();
        timerEl.innerHTML = `${hours}:${minutes}:${seconds}`;
        completedSecondsDaily++
        completedSecondsWeekly++
        completedSecondsMonthly++
        totalCompletedSeconds++
        updateCompletedTime(completedSecondsDaily, 1, completedTimeDailyEl, 'completedSecondsDaily')
        updateCompletedTime(completedSecondsWeekly, 1, completedTimeWeeklyEl, 'completedSecondsWeekly')
        updateCompletedTime(completedSecondsMonthly, 1, completedTimeMonthlyEl, 'completedSecondsMonthly')
        updateTotalCompletedTime()
    } else {
        updateTimerBar(breakSeconds, updatableBreakIntervalSeconds);
        const { hours, minutes, seconds } = updateBreakTime();
        timerEl.innerHTML = `${hours}:${minutes}:${seconds}`;
    }
}

function updateStatus(hours, minutes) {
    const hoursText = () => (hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '');
    const minutesText = () => (minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : 'less than a minute');
    statusTimeEl.innerHTML = `${hoursText()} ${minutesText()}`;
}

function updateTimerBar(completeSeconds, upadatableSeconds) {
    const completePercentage = (upadatableSeconds / completeSeconds) * 100;
    timerCircleEl.dataset.percent = completePercentage
    updateProgressBars()
}

function updateCompletedTime(seconds, expDays, element, cName) {
    const updatedTime = Twix.seperateSecondsToTime(seconds);
    const { hours, minutes } = updatedTime;
    setCookie(cName, seconds, expDays)
    element.innerText = `${hours}h ${minutes}m`
}

function updateTotalCompletedTime() {
    const updatedTime = Twix.seperateSecondsToTime(totalCompletedSeconds);
    const { hours, minutes } = updatedTime;
    localStorage.setItem('totalCompletedSeconds', totalCompletedSeconds)
    totalCompletedTimeEl.innerText = `${hours}h ${minutes}m`
}

function playDing() {
    if(!allowSound) {
        return
    }
    const ding = new Audio('./ding.mp3');
    ding.play();
}

function playAlarm() {
    if(!allowSound) {
        return
    }
    const alarm = new Audio('./alarm.mp3');
    alarm.play();
    setTimeout(Twix.stopAudio, 2000, alarm);
}

function sendEndNotification() {
    if (Notification.permission === 'granted' && !allowNotifications) {
        const notification = new Notification('Calm Focus', {
            body: `Focus Session: Ended after ${hoursToComplete} hours and ${minutesToComplete} minutes`,
            icon: './calmfocus.png',
        });
    }
}

updateSettings()
updateCompletedTime(completedSecondsDaily, 1, completedTimeDailyEl, 'completedSecondsDaily')
updateCompletedTime(completedSecondsWeekly, 1, completedTimeWeeklyEl, 'completedSecondsWeekly')
updateCompletedTime(completedSecondsMonthly, 1, completedTimeMonthlyEl, 'completedSecondsMonthly')
updateTotalCompletedTime()
screen.orientation.lock('portrait-primary')