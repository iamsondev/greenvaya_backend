export const USER_ROLE = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  MEMBER: 'MEMBER',
} as const;

export type TUserRole = keyof typeof USER_ROLE;
