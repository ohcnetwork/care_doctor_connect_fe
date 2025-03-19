import { FacilityOrganization } from "@/types/organization";
import { queryString, request } from "./request";
import { PaginatedResponse } from "./types";
import { FacilityUser } from "@/types/user";

export const apis = {
  organizations: {
    list: async (
      facilityId: string,
      query?: {
        limit?: number;
        offset?: number;
        parent?: string;
        level_cache?: number;
      }
    ) => {
      return await request<PaginatedResponse<FacilityOrganization>>(
        `/api/v1/facility/${facilityId}/organizations/` + queryString(query)
      );
    },

    users: {
      list: async (
        facilityId: string,
        organizationId: string,
        query?: {
          limit?: number;
          offset?: number;
        }
      ) => {
        return await request<PaginatedResponse<FacilityUser>>(
          `/api/v1/facility/${facilityId}/organizations/${organizationId}/users/` +
            queryString(query)
        );
      },
    },
  },
};
