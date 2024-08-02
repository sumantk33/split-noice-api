import { FastifyReply } from "fastify";
import { db } from "../../../services/db";
import { CustomError } from "../../../utils";
import { API_STATUS_CODES } from "../../../utils/constants";
import { createLoggerObj } from "../../../config/logger";
import { TransactionsType } from "../../../types";
import { validateSplitTypeToSplitAmount } from "./expenses.utils";
import { PRISMA_ERROR_CODES } from "../../../config/prisma-error";

/*
 * Fetch all the expenses of a group
 */
const getAllExpensesFromGroupIdQuery = async (groupId: string) => {
  const result = await db.expenses.findMany({
    where: {
      groupId: +groupId,
    },
  });
  if (result.length === 0) {
    throw new CustomError(`No expenses found of groupId-${groupId}`);
  }
  return result;
};

/*
 * Create a new expense for a group
 */
const createExpenseForAGroupQuery = async (
  reply: FastifyReply,
  groupId: string,
  payerId: number,
  amount: number,
  transactions: TransactionsType[],
  description?: string
) => {
  try {
    validateSplitTypeToSplitAmount(transactions, amount);

    const groupMembersToCheck = [
      {
        groupId: +groupId,
        userId: payerId,
      },
    ];
    transactions.forEach((txn) => {
      groupMembersToCheck.push({
        groupId: +groupId,
        userId: txn.userId,
      });
    });

    const results = await db.$transaction(
      groupMembersToCheck.map((member) =>
        db.groupMembers.findUnique({
          where: {
            groupId_userId: {
              groupId: member.groupId,
              userId: member.userId,
            },
          },
        })
      )
    );

    results.forEach((result, index) => {
      if (!result) {
        const membersNotPresentInTheGroup = groupMembersToCheck[index];
        throw new CustomError(
          `Payer - ${membersNotPresentInTheGroup.userId} is not a part of the group - ${membersNotPresentInTheGroup.groupId}`,
          API_STATUS_CODES.BAD_REQUEST
        );
      }
    });

    const expenseResult = await db.expenses.create({
      data: {
        groupId: +groupId,
        payerId,
        amount,
        description: description || null,
      },
    });

    reply.log.info(
      createLoggerObj(
        `Created expense for groupId - ${groupId} by PayerId - ${payerId}`,
        expenseResult
      )
    );

    const transactionsPayload = transactions.map((txn) => ({
      expenseId: expenseResult.id,
      userId: txn.userId,
      splitType: txn.splitType,
      splitAmount: txn.splitAmount,
    }));

    const txnResult = await db.transactions.createMany({
      data: transactionsPayload,
    });

    reply.log.info(
      createLoggerObj(
        `Created transactions for groupId - ${groupId} by PayerId - ${payerId}`,
        txnResult
      )
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw new CustomError(error.message, error.statusCode);
    }
    throw new CustomError();
  }
};

/*
 * Deleting an expense of a group
 */
const deleteAnExpenseFromGroupQuery = async (
  reply: FastifyReply,
  groupId: string,
  expenseId: number
) => {
  try {
    await db.transactions.deleteMany({
      where: {
        expenseId,
      },
    });

    reply.log.info(
      createLoggerObj(
        `Deleted all the transactions for expenseId - ${expenseId}`
      )
    );

    await db.expenses.delete({
      where: {
        id: expenseId,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === PRISMA_ERROR_CODES.P2025) {
      throw new CustomError(
        `GroupId ${groupId} dosen't exist`,
        API_STATUS_CODES.NOT_FOUND
      );
    }
    throw new CustomError();
  }
};

export {
  getAllExpensesFromGroupIdQuery,
  createExpenseForAGroupQuery,
  deleteAnExpenseFromGroupQuery,
};
