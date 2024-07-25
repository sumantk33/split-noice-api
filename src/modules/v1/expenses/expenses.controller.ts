import { FastifyReply, FastifyRequest } from "fastify";
import { formatApiResponse } from "../../../utils";
import { API_STATUS_CODES } from "../../../utils/constants";

const getAllExpenses = (req: FastifyRequest, reply: FastifyReply) => {
  reply.status(API_STATUS_CODES.OK).send(formatApiResponse("Expenses"));
};

export { getAllExpenses };
