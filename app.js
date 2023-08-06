import * as composeJS from './compose.js';

composeJS.renderBody(`
<main id="main" class="px-72">
    <header>
        <div>
            <span>Timer</span>
            <span>Settings</span>
        </div>
    </header>
    <div>
        <div>
            <button id="open-in-window"><i></i>&nbsp;Open in Window</button>
            <div><div id="timer-bar"></div></div>
            <div id="status">Up Next in <span id="status-time">4 mins</span>:<br><span id="next-status">Break</span></div>
            <div id="info">
                <span>Get ready to focus</span>
                <span>We'll send a notification and play an alarm when it's time to stop. We'll also play a ding sound it's time for a break.</span>
            </div>
            <span id="timer">00:00:00</span>
            <div>
                <label>
                    <input type="number" id="hours-input" data-input="yes">h&nbsp;&nbsp;
                </label>
                <label>
                    <input type="number" id="minutes-input" data-input="yes"> m
                </label>
            </div>
            <div>
                <button id="stop"><i></i>&nbsp;&nbsp;Stop</button>
                <button id="start">Start</button>
                <button id="pause"><i></i>&nbsp;&nbsp;Pause</button>
            </div>
        </div>
        <!-- <div>
            <span>Your Stats</span>
            <div>
                <div>
                    <span id="completed-time-daily" class="completed-time">1h 1m</span>
                </div>
                <div><div id="c-bar"></div></div>
                <span>Daily</span>
            </div>
            <div>
                <div>
                    <span id="completed-time-weekly" class="completed-time">1h 1m</span>
                </div>
                <div><div id="c-bar"></div></div>
                <span>Weekly</span>
            </div>
            <div>
                <div>
                    <span id="completed-time-monthly" class="completed-time">1h 1m</span>
                </div>
                <div><div id="c-bar"></div></div>
                <span>Monthly</span>
            </div>
        </div> -->
    </div>
</main>
`)