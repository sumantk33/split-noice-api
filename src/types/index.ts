import type { User, GroupMembers, Groups } from "@prisma/client";

type UserType = User;

type GroupMembersType = GroupMembers & { user: UserType };

type GroupDetailsType = Groups & {
  groupMembers: GroupMembersType[];
};

export { GroupMembersType, UserType, GroupDetailsType };
