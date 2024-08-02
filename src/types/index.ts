import type { User, GroupMembers, Groups, Transactions } from "@prisma/client";

type UserType = User;

type GroupMembersType = GroupMembers & { user: UserType };

type GroupDetailsType = Groups & {
  groupMembers: GroupMembersType[];
};

type TransactionsType = Transactions;

export { GroupMembersType, UserType, GroupDetailsType, TransactionsType };
