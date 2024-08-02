import { FastifyInstance } from "fastify";
import {
  createExpenseForAGroup,
  deleteAnExpenseFromGroup,
  getAllExpensesFromGroupId,
} from "./expenses.controller";
import { groupIdParamsValidationSchema } from "../groups/group.utils";
import {
  createExpenseForAGroupValidationSchema,
  deleteAnExpenseFromGroupValidationSchema,
} from "./expenses.utils";

async function expensesRouter(fastify: FastifyInstance) {
  fastify.get(
    "/group/:groupId",
    { schema: groupIdParamsValidationSchema },
    getAllExpensesFromGroupId
  );

  fastify.post(
    "/group/:groupId",
    { schema: createExpenseForAGroupValidationSchema },
    createExpenseForAGroup
  );

  fastify.delete(
    "/group/:groupId",
    { schema: deleteAnExpenseFromGroupValidationSchema },
    deleteAnExpenseFromGroup
  );
}

export default expensesRouter;
