import { GroupDetailsType } from "../../../types";

const groupIdParamsValidationSchema = {
  params: {
    type: "object",
    properties: {
      groupId: {
        type: "string",
        format: "number-string",
      },
    },
    required: ["groupId"],
    additionalProperties: false,
  },
};

const createGroupValidationSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
    },
    required: ["name"],
  },
};

const addMemberToGroupIdValidationSchema = {
  ...groupIdParamsValidationSchema,
  body: {
    type: "object",
    properties: {
      userId: {
        type: "number",
      },
    },
    required: ["userId"],
    additionalProperties: false,
  },
};

const deleteMemberFromGroupValidationSchema =
  addMemberToGroupIdValidationSchema;

const formatGroupDetailsResponse = (data: GroupDetailsType) => {
  const { groupMembers } = data;
  const formattedGroupMembers = groupMembers.map((member) => {
    const memberName = member.user.name;
    return {
      userId: member.userId,
      name: memberName,
    };
  });

  return {
    ...data,
    groupMembers: formattedGroupMembers,
  };
};

export {
  formatGroupDetailsResponse,
  createGroupValidationSchema,
  groupIdParamsValidationSchema,
  addMemberToGroupIdValidationSchema,
  deleteMemberFromGroupValidationSchema,
};
