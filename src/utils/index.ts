import { FastifyReply, FastifyRequest } from "fastify";
import zlib from "zlib";
import { STATIC_TEXT } from "./constants";
import { ulid } from "ulid";

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
  let errorMessageToBeShown = error.message;
  if (error.statusCode === 429) {
    errorMessageToBeShown = "Rate limit exceeded, Too many requests";
  }
  reply.log.error({ message: errorMessageToBeShown, reqId: request.id });
  reply
    .status(error.statusCode || 500)
    .send(formatApiResponse(null, errorMessageToBeShown));
};

/*
 * API utils
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
const formatApiResponse = (
  data: any = null,
  message?: string,
  status?: boolean
) => {
  const formattedStatus = status ?? !!data;
  const formattedMessage =
    message ?? (data ? "Success" : STATIC_TEXT.GENERIC_ERROR_MESSAGE);

  return {
    data,
    msg: formattedMessage,
    success: formattedStatus,
  };
};

/**
 * 404 handler
 */
const routeNotFoundHandler = (request: FastifyRequest, reply: FastifyReply) => {
  const errorMessage = `Route not found - ${request.url}`;
  reply.log.error({
    message: errorMessage,
    reqId: request.id,
  });
  reply.status(404).send(formatApiResponse(null, errorMessage));
};

/**
 * Compression config
 */
const compressionConfig = {
  global: true, // Apply compression globally (default)
  threshold: 1024, // Only compress responses larger than 1 KB
  zlibOptions: {
    level: 9, // Maximum compression level for gzip
  },
  brotliOptions: {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 4, // Set Brotli quality
    },
  },
  inflateIfDeflated: true,
};

/**
 * ULID utils
 */

const generateUlid = () => ulid();

export {
  CustomErrorType,
  formatApiResponse,
  CustomError,
  errorHandler,
  routeNotFoundHandler,
  compressionConfig,
  generateUlid,
};
