import { FastifyInstance, FastifyReply } from "fastify";
import { formatApiResponse } from "../../utils";

async function userRouter(fastify: FastifyInstance) {
  fastify.get("/", (_, reply: FastifyReply) => {
    reply.status(200).send(formatApiResponse("Users"));
  });
}

export default userRouter;
