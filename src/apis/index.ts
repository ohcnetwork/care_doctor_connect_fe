import { FacilityOrganization } from "@/types/organization";
import { queryString, request } from "./request";
import { PaginatedResponse } from "./types";

export const apis = {
  organizations: {
    list: async (
      facilityId: string,
      query?: {
        limit?: number;
        offset?: number;
      }
    ) => {
      return await request<PaginatedResponse<FacilityOrganization>>(
        `/api/v1/facility/${facilityId}/organizations/` + queryString(query)
      );
    },
  },
};
