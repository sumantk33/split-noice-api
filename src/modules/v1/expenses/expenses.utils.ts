import { TransactionsType } from "../../../types";
import { CustomError } from "../../../utils";
import { API_STATUS_CODES, SPLIT_TYPES } from "../../../utils/constants";
import { groupIdParamsValidationSchema } from "../groups/group.utils";

const createExpenseForAGroupValidationSchema = {
  ...groupIdParamsValidationSchema,
  body: {
    type: "object",
    properties: {
      payerId: { type: "number" },
      amount: { type: "number" },
      description: { type: "string" },
      transactions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            splitType: { type: "number" },
            splitAmount: { type: "number" },
            userId: { type: "number" },
          },
          required: ["splitType", "splitAmount", "userId"],
          additionalProperties: false,
        },
      },
    },
    required: ["payerId", "amount", "transactions"],
  },
};

const deleteAnExpenseFromGroupValidationSchema = {
  ...groupIdParamsValidationSchema,
  body: {
    type: "object",
    properties: {
      expenseId: { type: "number" },
    },
    required: ["expenseId"],
  },
};

const validateSplitTypeToSplitAmount = (
  transactions: TransactionsType[],
  totalAmount: number
) => {
  const splitType = transactions[0].splitType;
  const splitAmount = transactions[0].splitAmount;
  let splitAmountSum = transactions[0].splitAmount;

  for (let i = 1; i < transactions.length; i += 1) {
    if (splitType !== transactions[i].splitType) {
      throw new CustomError(
        "SplitType has to be the same for all the transactions",
        API_STATUS_CODES.BAD_REQUEST
      );
    }
    switch (splitType) {
      case SPLIT_TYPES.EVENLY: {
        if (splitAmount !== transactions[i].splitAmount) {
          throw new CustomError(
            "SplitAmount has to be the same for all the transactions if splitType is 0",
            API_STATUS_CODES.BAD_REQUEST
          );
        }
        break;
      }
      case SPLIT_TYPES.PERCENTAGE: {
        splitAmountSum += transactions[i].splitAmount;
        if (i === transactions.length - 1 && splitAmountSum !== 100) {
          throw new CustomError(
            "Sum of split percenatges has to be 100%",
            API_STATUS_CODES.BAD_REQUEST
          );
        }
        break;
      }
      case SPLIT_TYPES.AMOUNT: {
        splitAmountSum += transactions[i].splitAmount;
        if (i === transactions.length - 1 && splitAmountSum !== totalAmount) {
          throw new CustomError(
            `Sum of split amounts has to be equal to ${totalAmount}`,
            API_STATUS_CODES.BAD_REQUEST
          );
        }
        break;
      }
      default:
        break;
    }
  }
};

export {
  createExpenseForAGroupValidationSchema,
  deleteAnExpenseFromGroupValidationSchema,
  validateSplitTypeToSplitAmount,
};
