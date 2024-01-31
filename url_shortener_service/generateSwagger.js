const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'URL Shortener Authentication',
        description: 'API using to handle authentication of URL Shortener service'
    },
    host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/shortRoutes.ts', './src/routes/analyticsRoutes.ts']

swaggerAutogen(outputFile, endpointsFiles, doc);