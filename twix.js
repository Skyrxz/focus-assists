const Twix = {
    stripDecimal(decimalNumber = 0) {
        let stringDecimalNumber = decimalNumber.toString()
        let strippedDecimal = '0' + stringDecimalNumber.slice(stringDecimalNumber.indexOf('.'))
    
        return Number(strippedDecimal)
    },
    seperateSecondsToTime(seconds = 0, representInString = false) {
        if(seconds < 0) {
            seconds = 0
        }
        const date = new Date(null)
        date.setSeconds(seconds)
        const dateISO = date.toISOString()
        const convertedHours = dateISO.substring(11, 13)
        const convertedMinutes = dateISO.substring(14, 16)
        const convertedSeconds = dateISO.substring(17, 19)
        if (representInString) {
            return {
                hours: convertedHours,
                minutes: convertedMinutes,
                seconds: convertedSeconds
            }
        }
        return {
            hours: Number(convertedHours),
            minutes: Number(convertedMinutes),
            seconds: Number(convertedSeconds)
        }
    },
    stopAudio(audio) {
        audio.pause()
        audio.currentTime = 0
    },
}

export {Twix}