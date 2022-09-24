const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
var path = require('path');

var swagger_path =  path.resolve(__dirname, './../api-docs/swagger.yaml');
const swaggerDocument = YAML.load(swagger_path);

router.use(swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;