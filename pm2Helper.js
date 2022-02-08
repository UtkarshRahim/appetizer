const { exec } = require('child_process');
const {
  AV_PEM_LOCATION,
  LOCAL_PORT_FOR_TUNNEL,
  MONGO_DEV_DB,
  MONGO_DEV_URL,
  BACKEND_PATH_5x,
  BACKEND_PATH_6x,
  SSH_SERVICES_6X,
  DEV_BOX_URL,
} = require('./constants');

function twirl() {
  const P = ['\\', '|', '/', '-'];
  let x = 0;
  return setInterval(() => {
    process.stdout.write(`\r${P[x++]}`);
    x %= P.length;
  }, 100);
}

module.exports = {
  config: {
    xcro_deal_draft:
      'export PORT=11003 && export isDraft=true && pm2 start app.js --watch --ignore-watch "node_modules" --interpreter=/home/utkarsh/.nvm/versions/node/v10.24.1/bin/node',
    xcro_deal_live:
      'export PORT=11002 && export isDraft=false && pm2 start app.js --watch --ignore-watch "node_modules" --interpreter=/home/utkarsh/.nvm/versions/node/v10.24.1/bin/node',
  },

  defaultCommand:
    'pm2 start app.js --watch --ignore-watch "node_modules" --interpreter=/home/utkarsh/.nvm/versions/node/v10.24.1/bin/node',

  ui6xCommand:
    'pm2 start --interpreter=/home/utkarsh/.nvm/versions/node/v14.19.0/bin/node ./node_modules/@angular/cli/bin/ng -- serve --proxy-config proxy.config.remote.json --configuration es5',

  pathConfig: {
    xcro_deal_draft: 'xcro_deal',
    xcro_deal_live: 'xcro_deal',
  },

  ssh: async (location = MONGO_DEV_URL) => {
    return new Promise((resolve, reject) => {
      exec(
        `pm2 start "ssh -i ${AV_PEM_LOCATION}/av.pem -o 'ServerAliveInterval 60' -o 'ServerAliveCountMax 120' -L ${LOCAL_PORT_FOR_TUNNEL}:localhost:27017 ubuntu@${location}" --name mongo-ssh`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(error);
          }
          if (stderr) {
            console.error(stderr);
          }
          console.log('Started tunneling ');
          resolve(true);
        }
      );
    });
  },

  startMDM: async (db, is58 = false) => {
    return new Promise((resolve, reject) => {
      const path = is58 ? BACKEND_PATH_5x : BACKEND_PATH_6x;
      const name = is58 ? 'xcro_mdm' : 'upp-mdm';
      exec(
        `export MONGO_URL=${db} && cd ${path}/${name} && pm2 start app.js --watch --ignore-watch "node_modules" --name ${name} --interpreter=/home/utkarsh/.nvm/versions/node/v10.24.1/bin/node`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(error);
          }
          if (stderr) {
            console.error(stderr);
          }
          console.log('MDM started, now will start other services');
          resolve(true);
        }
      );
    });
  },

  startRedis: async () => {
    return new Promise((resolve, reject) => {
      exec(`pm2 start "redis-server" --name redis`, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
        }
        if (stderr) {
          console.error(stderr);
        }
        resolve(true);
      });
    });
  },

  delay: async (ms = 10000, showSpinner = true) => {
    return new Promise((resolve, reject) => {
      let loader;
      if (showSpinner) {
        loader = twirl();
      }
      setTimeout(() => {
        if (showSpinner) {
          clearInterval(loader);
          process.stdout.write('\b');
        }
        resolve(true);
      }, ms);
    });
  },

  startPM2: (db, services) => {
    services.forEach((service) => {
      setTimeout(() => {
        exec(
          `export MONGO_URL=${db} && ${
            service.location ? `cd ${service.location} && ` : ''
          } ${service.command} --name  ${service.name}`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(error);
            }
            if (stderr) {
              console.error(stderr);
            }
          }
        );
      }, 100);
    });
  },

  sshRest(_is58) {
    console.log('ssh-ing to dev services');
    SSH_SERVICES_6X.forEach((service) => {
      const portOutThere = 80;
      const url = DEV_BOX_URL;
      setTimeout(() => {
        exec(
          `pm2 start "ssh -i ${AV_PEM_LOCATION}/av.pem -o 'ServerAliveInterval 60' -o 'ServerAliveCountMax 120' -L ${service.port}:${service.devIp}:${portOutThere} ubuntu@${url}" --name ${service.name}-${service.port}`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(error);
            }
            if (stderr) {
              console.error(stderr);
            }
          }
        );
      }, 100);
    });
  },
};
