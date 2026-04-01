import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

import Autocomplete from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { I18NNAMESPACE } from "@/lib/constants";
import { Loader2, HeadsetIcon } from "lucide-react";
import OrganizationCollapsible from "./OrganizationCollapsible";
import { PatientInfoCardQuickActionsProps } from "@/components/pluggables/PatientInfoCardQuickActions";
import type { Role } from "@/types/role";
import { apis } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

type DoctorConnectSheetProps = PatientInfoCardQuickActionsProps;

export type Filters = {
  role?: string;
};

export default function DoctorConnectSheet({
  encounter,
  className,
}: DoctorConnectSheetProps) {
  const { t } = useTranslation(I18NNAMESPACE);

  const [roleSearch, setRoleSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { data: roles } = useQuery({
    queryKey: ["roles", roleSearch],
    queryFn: () => apis.roles.list({ name: roleSearch?.trim() ?? undefined }),
  });

  const filters: Filters = { role: selectedRole?.id ?? "" };

  useEffect(() => {
    const doctorRole = roles?.results.find(
      (role) => role.name.toLowerCase() === "doctor"
    );

    if (doctorRole && !selectedRole) {
      setSelectedRole(doctorRole);
    }
  }, [roles, selectedRole]);

  const roleOptions =
    [
      selectedRole,
      ...(roles?.results.filter((role) => role.id !== selectedRole?.id) ?? []),
    ]
      .filter(Boolean)
      .map((role) => ({
        label: role!.name,
        value: role!.id,
        display: (
          <div className="flex items-start flex-col text-left">
            <p>{role!.name}</p>
            {role!.description ? (
              <p className="text-xs text-muted-foreground">
                {role!.description}
              </p>
            ) : null}
          </div>
        ),
      })) ?? [];

  const { data: organizations, isPending } = useQuery({
    queryKey: ["organizations", encounter?.facility.id],
    queryFn: () =>
      apis.organizations.list(encounter?.facility.id, {
        level_cache: 0,
      }),
    enabled: !!encounter?.facility.id,
  });

  if (!organizations?.results?.length) {
    return null;
  }

  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="ghost" className={className}>
          {t("doctor_connect")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("doctor_connect")}</SheetTitle>
          <SheetDescription>{t("doctor_connect_description")}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex gap-2 flex-col">
          <Autocomplete
            options={roleOptions}
            value={selectedRole?.id}
            placeholder={t("filter_by_role")}
            onChange={(value) => {
              if (!value) {
                setSelectedRole(null);
                return;
              }
              const role =
                roles?.results.find((r) => r.id === value) ??
                (selectedRole?.id === value ? selectedRole : undefined);
              if (role) {
                setSelectedRole(role);
              }
            }}
            onSearch={setRoleSearch}
          />
        </div>

        <div className="grid gap-4 mt-4">
          {isPending ? (
            <div className="flex items-center justify-center h-64 gap-2">
              <Loader2 className="animate-spin size-5" />
              <p>{t("loading_organizations")}</p>
            </div>
          ) : (
            organizations?.results
              ?.filter((organization) => organization.level_cache === 0)
              .map((organization) => (
                <OrganizationCollapsible
                  key={organization.id}
                  facilityId={encounter.facility.id}
                  organization={organization}
                  filters={filters}
                />
              ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
