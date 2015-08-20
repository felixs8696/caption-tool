class MainController {
  constructor ($timeout, MaxCharPerLine) {
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1439969988401;
    this.activate($timeout);
    this.charLimit = MaxCharPerLine;
    this.subSceneArray = [];
  }

  activate($timeout) {
    $timeout(() => {
      this.classAnimation = 'rubberBand';
    }, 4000);
  }

  pushToSubSceneArray(subtitle) {
    this.subSceneArray.push(subtitle);
  }

  parseTranscriptIntoSubscenes(transcript) {
    this.subSceneArray = [];
    //let transcriptCopy = transcript;
    //while(transcriptCopy.indexOf("\n\n") !== -1) {
    //  console.log('checking');
    //  transcriptCopy = transcriptCopy.replace(/(\r\n\r\n|\n\n|\r\r)/gm,"&&");
    //}
    let transcriptCopy = transcript.replace(new RegExp('(\n){2,}', 'gim') , '\n');
    while (transcriptCopy.length > 0) {
      let subtitle = this.parseSubTitle(transcriptCopy);
      let subtitleLength = (subtitle.line1+ subtitle.line2).length;
      transcriptCopy = transcriptCopy.substring(subtitleLength, transcriptCopy.length);
      let line1 = this.deleteSpaces(subtitle.line1);
      let line2 = this.deleteSpaces(subtitle.line2);
      if (line2) {
        subtitle = {
          line1: line1,
          line2: line2
        };
      } else {
        subtitle = {
          line1: line1
        };
      }
      let subtitleString = this.stringifySubtitleObject(subtitle);
      this.pushToSubSceneArray(subtitleString);
    }
    console.log(this.subSceneArray);
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
      } else if (transcript.length < this.charLimit * 2) {
        maxBreakIndex2 = transcript.length - this.charLimit;
      }
      let maxSubLine1 = transcript.substring(0, maxBreakIndex1);
      let actualSubLine1 = this.parseSubLine(maxSubLine1);
      if (getTwoLines) {
        let maxSubLine2 = transcript.substring(actualSubLine1.length, actualSubLine1.length + maxBreakIndex2);
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
        console.log('adding line break at: ', subtitleObj[key] );
        resultString += '\n';
      }
    }
    return resultString;
  }

  parseSubLine(maxSubLine) {
    let actualSubLine = '';
    for (let i = 1; i <= 10; i++) {
      let currentLetter = maxSubLine.charAt(maxSubLine.length - i);
      if(this.isNotLetter(currentLetter) || i === maxSubLine.length) {
        actualSubLine = maxSubLine.substring(0, maxSubLine.length - i);
        break;
      }
    }
    if (actualSubLine === '') {
      actualSubLine = maxSubLine.substring(0, maxSubLine.length - 2) + '-';
    }
    return actualSubLine;
  }

  isNotLetter(character) {
    var code = character.charCodeAt(0);
    return !(((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122)));
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
}

export default MainController;
