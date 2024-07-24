import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import { ulid } from "ulid";

import { errorHandler, formatApiResponse } from "./utils";
import loggerConfig from "./config/logger";

const fastify = Fastify({
  logger: loggerConfig,
  genReqId: () => ulid(),
});

// Enable CORS
fastify.register(cors);

// Add security headers
fastify.register(helmet);

// Add common error handler
fastify.setErrorHandler(errorHandler);

fastify.get("/api/healthcheck", async (_, reply: FastifyReply) => {
  reply.status(200).send(formatApiResponse("Server up and running"));
});

export default fastify;
