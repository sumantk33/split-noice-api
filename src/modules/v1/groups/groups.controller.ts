import { FastifyReply, FastifyRequest } from "fastify";
import { API_STATUS_CODES } from "../../../utils/constants";
import { formatApiResponse } from "../../../utils";
import {
  createGroupQuery,
  fetchGroupByIdQuery,
  deleteGroupByIdQuery,
  addMemberToGroupQuery,
  removeMemberFromGroupQuery,
} from "./group.query";
import { createLoggerObj } from "../../../config/logger";

const getGroupDetailsById = async (
  req: FastifyRequest<{ Params: { groupId: number } }>,
  reply: FastifyReply
) => {
  const { groupId } = req.params;
  const groupData = await fetchGroupByIdQuery(groupId);
  reply.status(API_STATUS_CODES.OK).send(formatApiResponse(groupData));
};

const createGroup = async (
  req: FastifyRequest<{ Body: { name: string } }>,
  reply: FastifyReply
) => {
  const { name } = req.body;
  reply.log.info(createLoggerObj("Creating group", { name }));

  const result = await createGroupQuery(name);
  reply.log.info(createLoggerObj("Created group with ID", { result }));

  reply
    .status(API_STATUS_CODES.CREATED)
    .send(formatApiResponse(null, "Group successfully created", true));
};

const deleteGroupById = async (
  req: FastifyRequest<{ Params: { groupId: string } }>,
  reply: FastifyReply
) => {
  const { groupId } = req.params;
  reply.log.info(createLoggerObj("Deleting group", { groupId }));

  await deleteGroupByIdQuery(groupId);

  reply.log.info(createLoggerObj("Deleted group with ID", { groupId }));
  reply
    .status(API_STATUS_CODES.OK)
    .send(formatApiResponse(null, `Group deleted with ID - ${groupId}`, true));
};

const addMemberToGroupId = async (
  req: FastifyRequest<{
    Params: { groupId: string };
    Body: { userId: number };
  }>,
  reply: FastifyReply
) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  reply.log.info(createLoggerObj(`Adding user-${userId} to group-${groupId}`));

  await addMemberToGroupQuery(groupId, userId);

  reply.log.info(createLoggerObj(`Added user-${userId} to group-${groupId}`));

  reply
    .status(200)
    .send(formatApiResponse(null, "User added successfully", true));
};

const deletMemberFromGroupId = async (
  req: FastifyRequest<{
    Params: { groupId: string };
    Body: { userId: number };
  }>,
  reply: FastifyReply
) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  reply.log.info(
    createLoggerObj(`Removing user-${userId} from group-${groupId}`)
  );

  await removeMemberFromGroupQuery(groupId, userId);

  reply.log.info(
    createLoggerObj(`Removed user-${userId} from group-${groupId}`)
  );

  reply
    .status(200)
    .send(formatApiResponse(null, "User removed successfully", true));
};

export {
  getGroupDetailsById,
  createGroup,
  deleteGroupById,
  addMemberToGroupId,
  deletMemberFromGroupId,
};
