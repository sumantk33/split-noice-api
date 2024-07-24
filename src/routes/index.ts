import { FastifyInstance } from "fastify";
import routesV1 from "./v1";

async function routesWrapper(fastify: FastifyInstance) {
  fastify.register(routesV1, { prefix: "/v1" });
}

export default routesWrapper;
