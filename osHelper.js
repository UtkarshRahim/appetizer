const { exec } = require('child_process');
const { defaultCommand, config } = require('./pm2Helper');
const {
  BACKEND_PATH_6x,
  BACKEND_PATH_5x,
  SERVICES_6X,
  SERVICES_5X,
} = require('./constants');

async function getListOfServices(is5x = false) {
  const path = is5x ? BACKEND_PATH_5x : BACKEND_PATH_6x;
  return new Promise((resolve, reject) => {
    const services = (is5x ? SERVICES_5X : SERVICES_6X).map((service) => {
      return {
        name: service,
        location: `${path}/${service}`,
        command: defaultCommand,
      };
    });
    resolve(services);
  });
}
async function getDealsService(is5x = false) {
  const dealLive = is5x ? 'xcro_deal_live_58' : 'xcro_deal_live';
  const dealdraft = is5x ? 'xcro_deal_draft_58' : 'xcro_deal_draft';
  const path = is5x ? BACKEND_PATH_5x : BACKEND_PATH_6x;
  const name = is5x ? 'xcro_deal': 'upp-deal';
  return new Promise((resolve, reject) => {
    const services = [
      {
        name: dealLive,
        location: `${path}/${name}`,
        command: config.xcro_deal_live,
      },
      {
        name: dealdraft,
        location: `${path}/${name}`,
        command: config.xcro_deal_draft,
      },
    ];
    resolve(services);
  });
}

module.exports = {
  getListOfServices,
  getDealsService,
};
