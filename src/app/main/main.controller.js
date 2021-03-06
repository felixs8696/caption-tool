class MainController {
  constructor ($timeout, MaxCharPerLine, $window) {
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1439969988401;
    this.activate($timeout);
    this.charLimit = MaxCharPerLine;
    this.subSceneArray = [];
    this.transcriptSceneList = [];
    this.showAutoTimes = false;
    this.window = $window;
  }

  activate($timeout) {
    $timeout(() => {
      this.classAnimation = 'rubberBand';
    }, 4000);
  }

  autoTimeVal(index, key) {
    var timeVal = '';
    if (key === 'start') {
      timeVal = index * 5;
    } else if (key === 'end') {
      timeVal = (index + 1) * 5;
    }
    if (this.showAutoTimes) {
      if (this.subSceneArray[index]) {
        if (key === 'start') {
          this.subSceneArray[index].startTime = this.placeholderTime(timeVal);
        } else if (key === 'end') {
          this.subSceneArray[index].endTime = this.placeholderTime(timeVal);
        }
      }
      return this.placeholderTime(timeVal);
    }
  }

  generateAutoTimes() {
    this.showAutoTimes = true;
  }

  pushToSubSceneArray(subtitle) {
    this.subSceneArray.push({
      index: this.subSceneArray.length + 1,
      content: subtitle
    });
  }

  compileTranscriptScenes(transcript) {
    this.subSceneArray = [];
    this.transcriptSceneList = transcript.split(">>>>>>");
    for (var i = 0;i < this.transcriptSceneList.length; i++) {
      this.parseTranscriptIntoSubscenes(this.transcriptSceneList[i]);
    }
    console.log(this.subSceneArray);
  }

  parseTranscriptIntoSubscenes(transcript) {
    let transcriptCopy = transcript.replace(/(\r\n|\n|\r)/gm," ");
    while (transcriptCopy.length > 0) {
      let subtitle = this.parseSubTitle(transcriptCopy);
      let subtitleLength = (subtitle.line1+ subtitle.line2).length;
      let line1 = this.deleteSpaces(subtitle.line1);
      let line2 = this.deleteSpaces(subtitle.line2);
      let trimmedSubtitle = subtitle;
      if (line2) {
        trimmedSubtitle = {
          line1: line1,
          line2: line2
        };
      } else {
        trimmedSubtitle = {
          line1: line1
        };
      }
      let subtitleString = this.stringifySubtitleObject(trimmedSubtitle);
      if (subtitleString.charAt(subtitleString.length-2) === '-') {
        subtitleLength = subtitleLength - 1;
      }
      transcriptCopy = transcriptCopy.substring(subtitleLength, transcriptCopy.length);
      this.pushToSubSceneArray(subtitleString);
    }
  }

  deleteSpaces(subtitleLine) {
    if(subtitleLine) {
      subtitleLine = subtitleLine.trim();
      subtitleLine = subtitleLine.replace(/\uFFFD/g, '')
    }
    return subtitleLine;
  }

  parseSubTitle(transcript) {
    let subtitleObj = {};
    if (transcript.length > 0) {
      let maxBreakIndex1 = this.charLimit;
      let maxBreakIndex2 = this.charLimit;
      let getTwoLines = true;
      if (transcript.length < this.charLimit) {
        maxBreakIndex1 = transcript.length;
        getTwoLines = false;
      }
      let maxSubLine1 = transcript.substring(0, maxBreakIndex1);
      let actualSubLine1 = this.parseSubLine(maxSubLine1);
      if (getTwoLines) {
        if (transcript.length < this.charLimit * 2) {
          maxBreakIndex2 = transcript.length;
        }
        let maxSubLine2 = transcript.substring(actualSubLine1.length, actualSubLine1.length + maxBreakIndex2);
        console.log(maxSubLine2);
        let actualSubLine2 = this.parseSubLine(maxSubLine2);
        subtitleObj = {
          line1: actualSubLine1,
          line2: actualSubLine2
        };
        return subtitleObj;
      } else {
        subtitleObj = {
          line1: actualSubLine1
        };
        return subtitleObj;
      }
    } else {
      return subtitleObj;
    }
  }

  stringifySubtitleObject(subtitleObj) {
    let resultString = '';
    for (var key in subtitleObj) {
      resultString += subtitleObj[key];
      if (key !== subtitleObj[subtitleObj[subtitleObj.length - 1]]) {
        resultString += '\n';
      }
    }
    return resultString;
  }

  parseSubLine(maxSubLine) {
    if (maxSubLine.length === this.charLimit) {
      let actualSubLine = '';
      for (let i = 1; i <= 13; i++) {
        let currentLetter = maxSubLine.charAt(maxSubLine.length - i);
        if(this.isNotLetter(currentLetter) || i === maxSubLine.length) {
          actualSubLine = maxSubLine.substring(0, maxSubLine.length - i + 1);
        }
        if (this.isASpace(currentLetter)) {
          actualSubLine = maxSubLine.substring(0, maxSubLine.length - i + 1);
          break;
        }
      }
      if (actualSubLine === '') {
        if (maxSubLine.length === this.charLimit) {
          actualSubLine = maxSubLine.substring(0, maxSubLine.length-1) + '-';
        } else {
          actualSubLine = maxSubLine.substring(0, maxSubLine.length);
        }
      }
      return actualSubLine;
    } else {
      return maxSubLine;
    }
  }

  isNotLetter(character) {
    var code = character.charCodeAt(0);
    return !(((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122)));
  }

  isASpace(character) {
    var code = character.charCodeAt(0);
    return code === 32;
  }

  placeholderTime(seconds) {
    let minutes = Math.floor(seconds/60);
    let hours = Math.floor(minutes/60);
    let secondsString = this.formatTimeString(seconds);
    let minutesString = this.formatTimeString(minutes);
    let hoursString = this.formatTimeString(hours);
    secondsString = this.formatTimeString(parseInt(secondsString) - (60 * parseInt(minutesString)));
    minutesString = this.formatTimeString(parseInt(minutesString) - (60 * parseInt(hoursString)));
    return hoursString + ':' + minutesString + ':' + secondsString + ':000';
  }

  formatTimeString(time) {
    if (time < 10) {
      time = '0' + time;
    }
    return time;
  }

  createSrtFile() {
    var srtText = this.generateSrtText();
    var link = document.getElementById('downloadlink');
    link.href = this.makeTextFile(srtText);
    link.style.display = 'block';
  }

  makeTextFile(text) {
    var textFile = null;
    var data = new Blob([text], {type: 'srt/plain'});
    if (textFile !== null) {
      this.window.URL.revokeObjectURL(textFile);
    }
    textFile = this.window.URL.createObjectURL(data);
    return textFile;
  }

  generateSrtText() {
    var srtText = '';
    for (var key in Object.keys(this.subSceneArray)) {
      let subtitleObj = this.subSceneArray[key];
      srtText += subtitleObj.index + '\n';
      srtText += this.generateTimeString(subtitleObj.startTime, subtitleObj.endTime) + '\n';
      srtText += subtitleObj.content + '\n\n';
    }
    return srtText;
  }

  parseTime(time) {
    var lastColonIndex = time.lastIndexOf(':');
    var ms = time.substring(lastColonIndex + 1, time.length);
    var timeString = time.substring(0, lastColonIndex) + ',' + ms;
    //to drag and drop with premier pro
    if (ms.length < 3) {
      timeString = time.substring(0, lastColonIndex) + ',' + ms + '0';
    }
    return timeString;
  }

  generateTimeString(startTime, endTime) {
    return this.parseTime(startTime) + ' --> ' + this.parseTime(endTime);
  }

}

export default MainController;
