import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { I18NNAMESPACE } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import OrganizationCollapsible from "./OrganizationCollapsible";
import { PatientInfoCardQuickActionsProps } from "@/components/pluggables/PatientInfoCardQuickActions";
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

  const [filters, setFilters] = useState<Filters>({
    role: "",
  });

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => apis.roles.list(),
  });

  useEffect(() => {
    const doctorRole = roles?.results.find(
      (role) => role.name.toLowerCase() === "doctor"
    );

    if (doctorRole) {
      setFilters((prev) => ({
        ...prev,
        role: doctorRole.id,
      }));
    }
  }, [roles]);

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
    <Sheet>
      <SheetTrigger asChild>
        <Button className={className}>{t("doctor_connect")}</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("doctor_connect")}</SheetTitle>
          <SheetDescription>{t("doctor_connect_description")}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex gap-2 flex-col">
          <Select
            name="role"
            value={filters.role}
            onValueChange={(value) => setFilters({ ...filters, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filter_by_role")}>
                {filters.role &&
                  roles?.results?.find((role) => role.id === filters.role)
                    ?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {roles?.results?.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  <div className="flex items-start flex-col">
                    <p>{role.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
