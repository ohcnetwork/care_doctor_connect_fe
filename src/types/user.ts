export type User = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  last_login: string;
  profile_picture_url?: string;
  prefix?: string;
  suffix?: string;
  user_type: "staff" | "admin";
  gender: "male" | "female" | "other";
  username: string;
};

export type Permission = {
  context: string;
  description?: string;
  name: string;
  slug: string;
};

export type Role = {
  id: string;
  name: string;
  description?: string;
  is_system?: boolean;
  permissions: Permission[];
};

export type FacilityUser = {
  id: string;
  role: Role;
  user: User;
};
