import { FastifyReply, FastifyRequest } from "fastify";
import { formatApiResponse } from "../../../utils";
import { API_STATUS_CODES } from "../../../utils/constants";

const getAllUsers = (req: FastifyRequest, reply: FastifyReply) => {
  reply.status(API_STATUS_CODES.OK).send(formatApiResponse("Users"));
};

export { getAllUsers };
