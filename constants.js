module.exports = {
  SELECTIONS: [
    {
      type: 'list',
      name: 'environment',
      message: 'Please select the environment',
      choices: ['dev', '58', 'pt'],
    },
  ],
  BACKEND_PATH_6x: '/home/utkarsh/work/dev',
  BACKEND_PATH_5x: '/home/utkarsh/work/sit',
  MONGO_DEV_URL: '13.126.150.28',
  MONGO_58_URL: '3.108.111.238',
  MONGO_PT_URL: '3.110.218.200',
  MONGO_DEV_DB: 'xcro6-db',
  MONGO_PT_DB: 'xcropt-db',
  MONGO_58_DB: 'xcro-5x-db',
  DEV_BOX_URL: '3.7.121.236',
  AV_PEM_LOCATION: '/home/utkarsh',
  LOCAL_PORT_FOR_TUNNEL: '27027',
  SERVICES_6X: [
    'upp-execution',
    'upp-idam',
    'upp-bff',
    'upp-dms',
    'upp-bpm',
    'upp-report',
    'upp-payment',
    'upp-deal',
  ],
  SERVICES_5X: [
    'xcro_execution',
    'xcro_idam',
    'xcro_bff',
    'xcro_dms',
    'xcro_bpm',
    'xcro_report',
  ],
  SSH_SERVICES_6X: [
    {
      name: 'cbs',
      port: '12001',
      devIp: '10.105.1.0',
    },
    {
      name: 'calendar',
      port: '11023',
      devIp: '10.97.41.181',
    },
    {
      name: 'instruction',
      port: '11024',
      devIp: '10.110.215.97',
    },
    {
      name: 'audit',
      port: '11028',
      devIp: '10.110.166.107',
    },
  ],
};