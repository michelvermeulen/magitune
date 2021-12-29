import { get } from "axios"
import { v4 as uuid } from "uuid";


/* eslint-disable */
const TEMPO_SLOW = 60;
const TEMPO_MEDIUM = 80;
const TEMPO_NORMAL = 100;
const TEMPO_FAST = 120;

const BEATSPERMEASURE_JIG = 6;
const BEATSPERMEASURE_REEL = 4;
const BEATSPERMEASURE_MARCH = 4;
const BEATSPERMEASURE_STRATHSPEY = 4;

const KEYS = [
  "Cdorian",
  "Cmajor",
  "Dminor",
  "Ddorian",
  "Dmixolydian",
  "Dmajor",
  "Eminor",
  "Edorian",
  "Emixolydian",
  "Emajor",
  "Fdorian",
  "Fmajor",
  "Gminor",
  "Gdorian",
  "Gmixolydian",
  "Gmajor",
  "Bminor",
  "Bmixolydian",
  "Bdorian",
  "Aminor",
  "Adorian",
  "Amixolydian",
  "Amajor",
]

let findTune = async (index, selectedTunes, tunebook) => {
  let key = null;
  let type = null;
  let previousTune = null;
  let nextTune = null;
  if (index > 0) {
    previousTune = selectedTunes[index - 1]["settings"][0];
    previousTune.type = selectedTunes[index - 1].type
  }
  if (index < selectedTunes.length) {
    nextTune = selectedTunes[index]['settings'][0];
    nextTune.type = selectedTunes[index].type
  }

  // Find tune type
  if (previousTune && nextTune) {
    type = previousTune.type;
  }
  if (!type) {
    if (index == selectedTunes.length && previousTune.type == "jig") {
      type = random(['jig', 'jig', 'jig', 'jig', 'jig', 'jig', 'reel'])
    }
  }

  if (!type) {
    if (index == selectedTunes.length) {
      type = previousTune.type
    }
  }

  if (!type) {
    if (index == 0) {
      type = nextTune.type
    }
  }

  console.log(type);

  // Find key
  if (previousTune && nextTune && previousTune.key == nextTune.key) {
    key = previousTune.key
  }
  if (!key) {
    if (index == 0 && nextTune.key.indexOf('major')) {
      key = nextTune.key.slice(0, 1) + "minor";
    }
  }
  if (!key) {
    if (index == selectedTunes.length) {
      // let minIndex = KEYS.indexOf(previousTune.key);
      let availableKeys = KEYS.filter(e => e.indexOf('major') > 0 && e !== previousTune.key)
      key = random(availableKeys);

      // Filter on 
    }
    if (index == 0) {
      // let minIndex = KEYS.indexOf(previousTune.key);
      let availableKeys = KEYS.filter(e => e !== previousTune.key)
      key = random(availableKeys);

      // Filter on 
    }
  }

  let tunes = await getTunes(type, key);

  tunebook.tunes.filter(e => e.type == type && e.key == key).forEach(tune => {
    tunes.push(tune);
    tunes.push(tune);
  })

  let tune = random(tunes);
  return tune;

  // console.log(tunes);
}

let getTunes = (type, key) => {
  return new Promise(resolve => {
    get("https://thesession.org/tunes/search?q=&type=" + type + "&mode=" + key + "&perpage=30&format=json")
      .then((ret) => {
        let tunes = ret.data;
        if (typeof tunes !== "object") tunes = dJSON.parse(ret.data);

        tunes.tunes.forEach((tune) => {
          tune.uuid = uuid();
        })
        resolve(tunes.tunes);
      })
      .catch((e) => {
        console.log(e);
      });
  });
}

let parse = (tunes, tempoStr) => {

  let timeline = [];

  let totalMeasureCount = 0, measureLength = 0;

  let repeat = false;

  tunes.forEach(tune => {
    timeline.push({
      action: 'play',
      time: Math.round(totalMeasureCount * measureLength * 100) / 100,
      key: tune.settings[0].key.slice(0, 1),
      type: tune.type
    });
    let measureCount = 0;

    let factor = tune.type == "jig" ? 3 : 2;

    let beatsPerMeasure = eval("BEATSPERMEASURE_" + tune.type.toUpperCase())
    let tempo = eval("TEMPO_" + tempoStr.toUpperCase()) * factor;
    measureLength = 60 / (tempo / beatsPerMeasure)

    let measures = tune.settings[0].abc.split('|');

    // Remove !, we won't use them
    measures = measures.map(e => e.replace('!', ''));
    // Clean empty measures and anacrouses
    measures = measures.filter(e => e.trim().length > 0)

    // Count measures
    repeat = false;

    measures.forEach((m, index) => {
      if (m.indexOf(':') == 0) repeat = true;

      if (m.indexOf('1') == 0) repeat = false;

      // Bugfix bad formatted ABC (no repeat at start)
      if (!repeat && !m.indexOf('1') == 0 && !m.indexOf('2') == 0) {
        let cur = index;
        while (typeof measures[cur] !== 'undefined') {
          if (measures[cur].indexOf(':') == 0) {
            break;
          }
          if (measures[cur].indexOf(':') > 1 && measures[index - 1].indexOf('1') !== 0 && measures[index - 1].indexOf('2') !== 0) {
            repeat = true;
            break;
          }
          cur++;
        }
      }

      if (m.length > 4) {

        measureCount++;

        if (repeat) {
          measureCount++;
        }
      }

      if ((m.indexOf(':') > 1 && measures[index - 1].indexOf('1') !== 0 && m.indexOf('1') !== 0)) repeat = false;
    })

    console.log(measureCount);
    measureCount *= tune.repeat

    totalMeasureCount += measureCount

    // console.log(measureCount);

  })


  timeline.push({
    action: 'stop',
    time: Math.round(totalMeasureCount * measureLength * 100) / 100,
  });

  return timeline;
}

let random = (array) => {
  return array[Math.floor(Math.random() * array.length)];

}

export {
  parse,
  findTune,
  TEMPO_SLOW,
  TEMPO_MEDIUM,
  TEMPO_NORMAL,
  TEMPO_FAST
}

/* eslint-enable */
