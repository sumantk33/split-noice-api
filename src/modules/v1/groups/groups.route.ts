import { FastifyInstance } from "fastify";
import {
  addMemberToGroupId,
  createGroup,
  deleteGroupById,
  deletMemberFromGroupId,
  getGroupDetailsById,
} from "./groups.controller";
import {
  addMemberToGroupIdValidationSchema,
  createGroupValidationSchema,
  deleteMemberFromGroupValidationSchema,
  groupIdParamsValidationSchema,
} from "./group.utils";

async function groupRouter(fastify: FastifyInstance) {
  fastify.get(
    "/:groupId",
    { schema: groupIdParamsValidationSchema },
    getGroupDetailsById
  );

  fastify.post("/create", { schema: createGroupValidationSchema }, createGroup);

  fastify.delete(
    "/:groupId",
    { schema: groupIdParamsValidationSchema },
    deleteGroupById
  );

  fastify.post(
    "/:groupId/add",
    { schema: addMemberToGroupIdValidationSchema },
    addMemberToGroupId
  );

  fastify.delete(
    "/:groupId/remove",
    { schema: deleteMemberFromGroupValidationSchema },
    deletMemberFromGroupId
  );
}

export default groupRouter;
