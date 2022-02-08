const inquirer = require('inquirer');
const { getListOfServices, getDealsService } = require('./osHelper');
const {
  startPM2,
  startMDM,
  delay,
  ssh,
  startRedis,
  sshRest,
} = require('./pm2Helper');
const { SELECTIONS } = require('./constants');
const {
  MONGO_58_URL,
  MONGO_PT_URL,
  MONGO_DEV_URL,
  LOCAL_PORT_FOR_TUNNEL,
  MONGO_PT_DB,
  MONGO_58_DB,
  MONGO_DEV_DB,
} = require('./constants');

let services = [];
let answer = {};
let db = '';
let url = '';
let is58 = false;
let isDev = false;
let isPT = false;
async function start() {
  inquirer
    .prompt(SELECTIONS)
    .then((_answer) => preInit(_answer))
    .then(() => getListOfServices(is58))
    .then((_services) => postInit(_services))
    .then(() => ssh(url))
    .then(() => startRedis())
    .then(() => delay(2000))
    .then(() => startMDM(db, is58))
    .then(() => delay())
    .then(() => startPM2(db, services))
    .then(() => delay(500, false))
    .then(() => (is58 ? getDealsService(is58) : ''))
    .then((dealServices) => (is58 ? startPM2(db, dealServices) : ''))
    .then(() => sshRest())
    .catch((error) => console.error('error', error));
}

async function preInit(_answer) {
  return new Promise((resolve, reject) => {
    answer = _answer;
    is58 = answer.environment === '58';
    isDev = answer.environment === 'dev';
    isPT = answer.environment === 'pt';
    setDB();
    setURL();
    resolve(true);
  });
}

async function postInit(_services) {
  return new Promise((resolve, reject) => {
    services = _services;
    resolve(true);
  });
}

setDB = () =>
  (db = isDev
    ? `mongodb://localhost:${LOCAL_PORT_FOR_TUNNEL}/${MONGO_DEV_DB}`
    : isPT
    ? `mongodb://localhost:${LOCAL_PORT_FOR_TUNNEL}/${MONGO_PT_DB}`
    : `localhost:${LOCAL_PORT_FOR_TUNNEL}/${MONGO_58_DB}`);

setURL = () =>
  (url = is58 ? MONGO_58_URL : isPT ? MONGO_PT_URL : MONGO_DEV_URL);

module.exports = {
  start,
};
