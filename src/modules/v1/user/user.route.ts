import { FastifyInstance } from "fastify";
import { getAllUsers } from "./user.controller";

async function userRouter(fastify: FastifyInstance) {
  fastify.get("/", getAllUsers);
}

export default userRouter;
