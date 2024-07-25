import { FastifyInstance } from "fastify";
import { getAllExpenses } from "./expenses.controller";

async function expensesRouter(fastify: FastifyInstance) {
  fastify.get("/", getAllExpenses);
}

export default expensesRouter;
