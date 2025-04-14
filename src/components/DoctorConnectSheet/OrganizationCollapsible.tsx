import { ChevronRight, Loader2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { FacilityOrganization } from "@/types/organization";
import { Filters } from ".";
import { I18NNAMESPACE } from "@/lib/constants";
import UserCard from "./UserCard";
import { apis } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

type OrganizationCollapsibleProps = {
  facilityId: string;
  organization: FacilityOrganization;
  level?: number;
  filters: Filters;
};

export default function OrganizationCollapsible({
  facilityId,
  organization,
  level = 0,
  filters,
}: OrganizationCollapsibleProps) {
  const { t } = useTranslation(I18NNAMESPACE);

  const [isExpanded, setIsExpanded] = useState(level === 0 ? true : false);

  const { data: organizationUsers, isPending: isOrganizationUsersPending } =
    useQuery({
      queryKey: ["organization_users", facilityId, organization.id],
      queryFn: () =>
        apis.organizations.users.list(facilityId, organization.id, {
          ...filters,
          limit: 1000,
        }),
      enabled: isExpanded,
    });

  const { data: subOrganizations, isPending: isSubOrganizationsPending } =
    useQuery({
      queryKey: ["sub_organizations", facilityId, organization.id],
      queryFn: () =>
        apis.organizations.list(facilityId, {
          parent: organization.id,
        }),
      enabled: isExpanded,
    });

  const filteredOrganizationUsers = useMemo(() => {
    return organizationUsers?.results.filter((user) => {
      if (filters.role) {
        return user.role.id === filters.role;
      }
      return true;
    });
  }, [organizationUsers, filters]);

  return (
    <div
      key={organization.id}
      className="mb-4"
      style={{ marginLeft: `${level * 16}px` }}
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
          <CollapsibleTrigger className="flex flex-col cursor-pointer gap-1">
            <div className="flex items-center gap-1">
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? "rotate-90" : "rotate-0"
                }`}
              />
              <span className="font-medium">{organization.name}</span>
              <Badge variant="outline" className="ml-2 text-xs capitalize">
                {t(`organization_type_${organization.org_type}`)}
              </Badge>
            </div>
            {organization.description && (
              <p className="text-sm text-muted-foreground ml-5 text-start">
                {organization.description}
              </p>
            )}
          </CollapsibleTrigger>
          {!!filteredOrganizationUsers?.length && (
            <span className="text-xs text-muted-foreground ml-auto">
              {t("organization_members", {
                count: filteredOrganizationUsers?.length,
              })}
            </span>
          )}
        </div>

        <CollapsibleContent>
          {isOrganizationUsersPending && isSubOrganizationsPending ? (
            <div className="flex items-center justify-center h-64 gap-2">
              <Loader2 className="animate-spin size-5" />
              <p>{t("loading_users_sub_organizations")}</p>
            </div>
          ) : (
            <>
              {!!filteredOrganizationUsers?.length && (
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {filteredOrganizationUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              )}

              {!!subOrganizations?.results.length && (
                <div className="mt-2">
                  {subOrganizations?.results.map((organization) => (
                    <OrganizationCollapsible
                      key={organization.id}
                      facilityId={facilityId}
                      organization={organization}
                      level={level + 1}
                      filters={filters}
                    />
                  ))}
                </div>
              )}

              {!filteredOrganizationUsers?.length &&
                !subOrganizations?.results?.length && (
                  <div className="py-2 text-center text-sm text-muted-foreground">
                    {t("no_users_sub_organizations")}
                  </div>
                )}
            </>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
