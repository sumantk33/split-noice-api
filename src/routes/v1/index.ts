import { FastifyInstance } from "fastify";
import userRoutesV1 from "./user.router";
import groupRoutesV1 from "./group.router";
import expensesRouter from "./expenses.router";

async function routesV1(fastify: FastifyInstance) {
  fastify.register(userRoutesV1, { prefix: "/users" });
  fastify.register(groupRoutesV1, { prefix: "/groups" });
  fastify.register(expensesRouter, { prefix: "/expenses" });
}

export default routesV1;
