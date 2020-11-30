const Logger = require('tln-logger');
const GraphqlMgr = require('./tln-graphql-mgr');
const WebServer = require('./tln-web-server');
const GraphqlServer = require('./tln-graphql-server');
const Iam = require('./tln-iam');

const logger = new Logger();

const graphqlMgr = new GraphqlMgr({
  logger,
  test: true,
});

const iam = new Iam({
  logger,
});
graphqlMgr.addSchema(iam.getSchema());

const webServer = new WebServer({
  logger,
  publicDir: '../public'
});

const graphqlServer = new GraphqlServer({
  logger,
  app: webServer.getApp(),
  graphqlMgr,
});

process.on('SIGTERM', () => {
  webServer.stop()
    .then(() => {})
    .catch(err => console.log(err));
})

webServer.start()
  .then(() => graphqlServer.start())
  .then(() => {
    console.log(logger.toString())
    console.log(graphqlMgr.toString())
    console.log(webServer.toString())
    console.log(graphqlServer.toString())    
    console.log(iam.toString())    
  })
  .catch(err => {
    console.log(err);
    process.kill(process.pid, 'SIGTERM');
  });

