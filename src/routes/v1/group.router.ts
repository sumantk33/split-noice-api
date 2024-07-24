import { FastifyInstance, FastifyReply } from "fastify";
import { formatApiResponse } from "../../utils";

async function groupRouter(fastify: FastifyInstance) {
  fastify.get("/", (_, reply: FastifyReply) => {
    reply.status(200).send(formatApiResponse("Groups"));
  });
}

export default groupRouter;
