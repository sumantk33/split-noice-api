import { FastifyLoggerOptions, FastifyRequest } from "fastify";

const loggerConfig: FastifyLoggerOptions = {
  level: "info",
  serializers: {
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
    req(req: FastifyRequest) {
      const headers = req.headers;
      delete headers["authorization"];
      return {
        method: req.method,
        url: req.url,
        parameters: req.params,
        headers,
      };
    },
  },
};

export default loggerConfig;
