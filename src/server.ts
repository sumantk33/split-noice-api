import Fastify, { FastifyReply } from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import compress from "@fastify/compress";
import routesWrapper from "./routes";

import {
  compressionConfig,
  errorHandler,
  formatApiResponse,
  routeNotFoundHandler,
} from "./utils";
import loggerConfig from "./config/logger";

const fastify = Fastify(loggerConfig);

// Enable CORS
fastify.register(cors);

// Add security headers
fastify.register(helmet);

// Add compression
fastify.register(compress, compressionConfig);

// Add common error handler
fastify.setErrorHandler(errorHandler);

// 404 handler
fastify.setNotFoundHandler(routeNotFoundHandler);

fastify.register(routesWrapper, { prefix: "/api" });

fastify.get("/api/healthcheck", async (_, reply: FastifyReply) => {
  reply.status(200).send(formatApiResponse("Server up and running"));
});

export default fastify;
