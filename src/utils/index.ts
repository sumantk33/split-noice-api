import { FastifyReply, FastifyRequest } from "fastify";
import { STATIC_TEXT } from "./constants";

/**
 * Error Utils
 */
interface CustomErrorType extends Error {
  statusCode: number;
}

class CustomError extends Error implements CustomErrorType {
  public statusCode: number;

  constructor(message: string, status?: number) {
    super(message);
    this.statusCode = status ?? 500;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

const errorHandler = (
  error: CustomErrorType,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.log.error({ message: error.message, reqId: request.id });
  reply.status(error.statusCode).send(formatApiResponse());
};

/*
 * API utils
 */
const formatApiResponse = (
  data: any = null,
  message?: string,
  status?: boolean
) => {
  const formattedStatus = status ?? !!data;
  const formattedMessage =
    message ?? (!!data ? "Success" : STATIC_TEXT.GENERIC_ERROR_MESSAGE);

  return {
    data,
    msg: formattedMessage,
    success: formattedStatus,
  };
};

export { CustomErrorType, formatApiResponse, CustomError, errorHandler };
