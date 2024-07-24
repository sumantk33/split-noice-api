import { FastifyRequest } from "fastify";
import pino from "pino";
import { ulid } from "ulid";

const pinoConfig = pino({
  level: "info",
  base: null,
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
        params: req.params,
        headers,
      };
    },
  },
});

const loggerConfig = {
  logger: pinoConfig,
  genReqId: () => ulid(),
};

export default loggerConfig;
