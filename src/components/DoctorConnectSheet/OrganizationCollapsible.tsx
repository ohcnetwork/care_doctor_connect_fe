import { FacilityOrganization } from "@/types/organization";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { apis } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import UserCard from "./UserCard";
import { useTranslation } from "react-i18next";
import { I18NNAMESPACE } from "@/lib/constants";

type OrganizationCollapsibleProps = {
  facilityId: string;
  organization: FacilityOrganization;
  level?: number;
};

export default function OrganizationCollapsible({
  facilityId,
  organization,
  level = 0,
}: OrganizationCollapsibleProps) {
  const { t } = useTranslation(I18NNAMESPACE);

  const [isExpanded, setIsExpanded] = useState(false);

  const { data: organizationUsers, isPending: isOrganizationUsersPending } =
    useQuery({
      queryKey: ["organization_users", facilityId, organization.id],
      queryFn: () =>
        apis.organizations.users.list(facilityId, organization.id, {}),
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
          {!!organizationUsers?.results.length && (
            <span className="text-xs text-muted-foreground ml-auto">
              {t("organization_members", {
                count: organizationUsers?.results.length,
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
              {!!organizationUsers?.results.length && (
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {organizationUsers?.results.map((user) => (
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
                    />
                  ))}
                </div>
              )}

              {!organizationUsers?.results?.length &&
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
