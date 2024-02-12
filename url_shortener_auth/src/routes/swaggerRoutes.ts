import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerRouter = express.Router();
const swaggerDocument = YAML.load('./url_shortener_auth_swagger_v1.0.0.yaml');

swaggerRouter.use('/swagger', swaggerUi.serve);
swaggerRouter.get('/swagger', swaggerUi.setup(swaggerDocument));

export default swaggerRouter;