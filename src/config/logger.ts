import { FastifyRequest } from "fastify";
import pino from "pino";
import { generateUlid } from "../utils";

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

const FastifyInstanceConfig = {
  logger: pinoConfig,
  genReqId: generateUlid,
  ajv: {
    customOptions: {
      formats: {
        "number-string": (value: string) =>
          typeof value === "string" && !isNaN(Number(value)),
      },
    },
  },
};

const createLoggerObj = (action: string, data?: object) => {
  return { action, data };
};

export { createLoggerObj };
export default FastifyInstanceConfig;
