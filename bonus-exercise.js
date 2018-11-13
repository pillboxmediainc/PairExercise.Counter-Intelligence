'use strict';

const utf8 = require('utf8');
// console.log('test');

const { read, write } = require('./secrets');

// This is where we strike back.

async function theDoubleAgents() {
  let agentArray = [];
  for (let i = 0; i < 9; i++) {
    try {
      console.log(await read(`/agent/${i}`));
      agentArray.push(await read(`/agent/${i}`));
    } catch (err) {
      if (err.status === '503') {
        theDoubleAgents();
      }
    }
  }

  // console.log(agentArray);
  return agentArray;

  // 1. `read` the double agents files
  //    /agent/0 through
  //    /agent/9

  // 2. Some of the reads will fail. Retry in case of error 503
  //    (server unavailable).
  //    DO NOT RETRY in case of error 404 (Not Found) - just skip those
  //    (they were either retired or gave up)

  // 3. `console.log` them (in any order)
}

async function theSchedule(next) {
  // let currentNext = '';
  let currentData;
  let currentNext = next;
  let currentAgent;
  if (!next) {
    return currentData;
  }
  try {
    currentAgent = await read(`/schedule/${currentNext}`);
    currentData = JSON.parse(currentAgent).data;
    // console.log('agent', currentData);
    currentNext = JSON.parse(currentAgent).next;
    // console.log('currentNext', currentNext);
    return (currentData += await theSchedule(currentNext));
    // .slice(0, -4);
  } catch (err) {
    if (err.status === '503') {
      theSchedule(currentNext);
    }
  }

  // We need to find and infiltrate their upcoming meetings
  // Their schedule data is encoded in Base64 and splited
  // into multiple json Files.
  // Each file contains part of the information and a reference
  // to the next file.
  //
  // We got intel on the head file: '/schedule/TmV4dCB'
  //
  // 1. `read` /schedule/TmV4dCB - it's JSON - parse it
  // 2. The parsed data contains a `data` and `next` keys
  // 3. Keep reading the next files by following the `next` key
  //    until there is no next file.
  // 4. Server is inconsistent. Retry in case of error 503
  //    (server unavailable)
  // 5. Concatenate all pieces of data and convert it to an utf-8 string
  // 6. Log the string with the schedule
}

//GET RETURN OF THE SCHEDULE AND PRINT IT TO CONSOLE
let answer = theSchedule('TmV4dCB');

(async () => {
  let codedMessage = await answer;
  console.log(secret(codedMessage));
})();

//HELPER FUNCTION TO CONVERT CODE INTO SECRET MESSAGE
function secret(code) {
  let answer = new Buffer(code, 'base64').toString('utf8');
  return answer;
}

// (async () => {
//   try {
//     console.log('--- 1. the double agents ---');
//     await theDoubleAgents();
//     console.log('--- 2. the schedule ---');
//     await theSchedule('TmV4dCB');
//   } catch (err) {
//     console.error(err);
//   }
// })();
