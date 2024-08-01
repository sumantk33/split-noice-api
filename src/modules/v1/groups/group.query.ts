import { PRISMA_ERROR_CODES } from "../../../config/prisma-error";
import { db } from "../../../services/db";
import { CustomError } from "../../../utils";
import { API_STATUS_CODES } from "../../../utils/constants";
import { formatGroupDetailsResponse } from "./group.utils";

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
      API_STATUS_CODES.BAD_REQUEST
    );
  }
  return formatGroupDetailsResponse(groups);
};

const createGroupQuery = async (name: string) => {
  const result = await db.groups.create({
    data: {
      name,
    },
  });
  return result;
};

const deleteGroupByIdQuery = async (groupId: string) => {
  try {
    await db.groupMembers.deleteMany({
      where: {
        groupId: +groupId,
      },
    });

    await db.groups.delete({
      where: {
        id: +groupId,
      },
    });

    return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === PRISMA_ERROR_CODES.P2025) {
      throw new CustomError(`GroupId ${groupId} dosen't exist`, 404);
    }
    throw new CustomError();
  }
};

const addMemberToGroupQuery = async (groupId: string, userId: number) => {
  await db.groupMembers.create({
    data: {
      groupId: +groupId,
      userId,
    },
  });
};

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
        404
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
