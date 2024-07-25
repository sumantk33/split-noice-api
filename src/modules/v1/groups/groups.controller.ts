import { FastifyReply, FastifyRequest } from "fastify";
import { API_STATUS_CODES } from "../../../utils/constants";
import { formatApiResponse } from "../../../utils";

const getAllGroups = (req: FastifyRequest, reply: FastifyReply) => {
  reply.status(API_STATUS_CODES.OK).send(formatApiResponse("Groups"));
};

export { getAllGroups };
