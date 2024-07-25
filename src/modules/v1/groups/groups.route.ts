import { FastifyInstance } from "fastify";
import { getAllGroups } from "./groups.controller";

async function groupRouter(fastify: FastifyInstance) {
  fastify.get("/", getAllGroups);
}

export default groupRouter;
