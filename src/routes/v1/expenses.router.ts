import { FastifyInstance, FastifyReply } from "fastify";
import { formatApiResponse } from "../../utils";

async function expensesRouter(fastify: FastifyInstance) {
  fastify.get("/", (_, reply: FastifyReply) => {
    reply.status(200).send(formatApiResponse("Expenses"));
  });
}

export default expensesRouter;
