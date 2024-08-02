import { FastifyReply } from "fastify";
import { PRISMA_ERROR_CODES } from "../../../config/prisma-error";
import { db } from "../../../services/db";
import { CustomError } from "../../../utils";
import { API_STATUS_CODES } from "../../../utils/constants";
import { formatGroupDetailsResponse } from "./group.utils";
import { createLoggerObj } from "../../../config/logger";

/*
 * Fetch the group details by the groupId
 */
const fetchGroupByIdQuery = async (groupId: number) => {
  const groups = await db.groups.findUnique({
    where: { id: +groupId },
    include: {
      groupMembers: {
        include: {
          user: true,
        },
      },
    },
  });
  if (!groups) {
    throw new CustomError(
      `No group exists with ID - ${groupId}`,
      API_STATUS_CODES.NOT_FOUND
    );
  }
  return formatGroupDetailsResponse(groups);
};

/*
 * Create a new group
 */
const createGroupQuery = async (name: string, ownerId: number) => {
  const doesUserExist = await db.user.findUnique({
    where: {
      id: ownerId,
    },
  });

  if (!doesUserExist) {
    throw new CustomError(
      `User-${ownerId} does not exist`,
      API_STATUS_CODES.BAD_REQUEST
    );
  }

  const result = await db.groups.create({
    data: {
      name,
    },
  });

  await db.groupMembers.create({
    data: {
      groupId: result.id,
      userId: ownerId,
    },
  });
  return result;
};

/*
 * Delete a group by it's groupId
 */
const deleteGroupByIdQuery = async (reply: FastifyReply, groupId: string) => {
  try {
    // Todo: Add logic to check for any remaining balances

    reply.log.info(
      createLoggerObj(`Deleting all the members of group - ${groupId}`)
    );
    await db.groupMembers.deleteMany({
      where: {
        groupId: +groupId,
      },
    });

    reply.log.info(createLoggerObj(`Deleting the group - ${groupId}`));

    await db.groups.delete({
      where: {
        id: +groupId,
      },
    });

    return;
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

/*
 * Add a new user to an existing group
 */
const addMemberToGroupQuery = async (groupId: string, userId: number) => {
  try {
    await db.groupMembers.create({
      data: {
        groupId: +groupId,
        userId,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === PRISMA_ERROR_CODES.P2003) {
      throw new CustomError(
        `GroupId-${groupId} dosen't exist`,
        API_STATUS_CODES.NOT_FOUND
      );
    }
    throw new CustomError();
  }
};

/*
 * Remove a user to an existing group
 */
const removeMemberFromGroupQuery = async (groupId: string, userId: number) => {
  try {
    await db.groupMembers.delete({
      where: {
        groupId_userId: {
          groupId: +groupId,
          userId,
        },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === PRISMA_ERROR_CODES.P2025) {
      throw new CustomError(
        `UserId-${userId} is not a part of GroupId ${groupId}`,
        API_STATUS_CODES.NOT_FOUND
      );
    }
    throw new CustomError();
  }
};

export {
  fetchGroupByIdQuery,
  createGroupQuery,
  deleteGroupByIdQuery,
  addMemberToGroupQuery,
  removeMemberFromGroupQuery,
};
