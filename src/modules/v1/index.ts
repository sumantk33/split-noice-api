import { FastifyInstance } from "fastify";
import userRoutesV1 from "./user/user.route";
import groupRoutesV1 from "./groups/groups.route";
import expensesRouter from "./expenses/expenses.route";

async function routesV1(fastify: FastifyInstance) {
  fastify.register(userRoutesV1, { prefix: "/users" });
  fastify.register(groupRoutesV1, { prefix: "/groups" });
  fastify.register(expensesRouter, { prefix: "/expenses" });
}

export default routesV1;
