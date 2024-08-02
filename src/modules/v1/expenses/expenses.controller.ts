import { FastifyReply, FastifyRequest } from "fastify";
import { formatApiResponse } from "../../../utils";
import { API_STATUS_CODES } from "../../../utils/constants";
import {
  createExpenseForAGroupQuery,
  deleteAnExpenseFromGroupQuery,
  getAllExpensesFromGroupIdQuery,
} from "./expenses.query";
import { createLoggerObj } from "../../../config/logger";
import { TransactionsType } from "../../../types";

const getAllExpensesFromGroupId = async (
  req: FastifyRequest<{ Params: { groupId: string } }>,
  reply: FastifyReply
) => {
  const { groupId } = req.params;

  const results = await getAllExpensesFromGroupIdQuery(groupId);
  reply.status(API_STATUS_CODES.OK).send(formatApiResponse(results));
};

const createExpenseForAGroup = async (
  req: FastifyRequest<{
    Params: { groupId: string };
    Body: {
      payerId: number;
      amount: number;
      description?: string;
      transactions: TransactionsType[];
    };
  }>,
  reply: FastifyReply
) => {
  const { groupId } = req.params;
  const { payerId, amount, description, transactions } = req.body;

  reply.log.info(
    createLoggerObj(
      `Intitating expense creation for groupId-${groupId} by payer-${payerId}`,
      { ...req.params, ...req.body }
    )
  );

  await createExpenseForAGroupQuery(
    reply,
    groupId,
    payerId,
    amount,
    transactions,
    description
  );

  reply.log.info(
    createLoggerObj(
      `Created expense for groupId-${groupId} by payer-${payerId}`,
      { ...req.params, ...req.body }
    )
  );

  reply
    .status(API_STATUS_CODES.OK)
    .send(formatApiResponse(null, "Expense created successfully", true));
};

const deleteAnExpenseFromGroup = async (
  req: FastifyRequest<{
    Params: { groupId: string };
    Body: { expenseId: number };
  }>,
  reply: FastifyReply
) => {
  const { groupId } = req.params;
  const { expenseId } = req.body;

  reply.log.info(
    createLoggerObj(
      `Initialising deletion of expense for expenseId-${expenseId} of groupId-${groupId}`,
      { ...req.params, ...req.body }
    )
  );

  await deleteAnExpenseFromGroupQuery(reply, groupId, expenseId);

  reply.log.info(
    createLoggerObj(
      `Successfully deleted expense for expenseId-${expenseId} of groupId-${groupId}`,
      { ...req.params, ...req.body }
    )
  );

  reply
    .status(API_STATUS_CODES.OK)
    .send(formatApiResponse(null, "Expense deleted successfully", true));
};

export {
  getAllExpensesFromGroupId,
  createExpenseForAGroup,
  deleteAnExpenseFromGroup,
};
