import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { apis } from "@/apis";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { I18NNAMESPACE } from "@/lib/constants";
import { PatientInfoCardQuickActionsProps } from "@/components/pluggables/PatientInfoCardQuickActions";
import OrganizationCollapsible from "./OrganizationCollapsible";
import { Loader2 } from "lucide-react";

type DoctorConnectSheetProps = PatientInfoCardQuickActionsProps;

export default function DoctorConnectSheet({
  encounter,
  className,
}: DoctorConnectSheetProps) {
  const { t } = useTranslation(I18NNAMESPACE);

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
      <SheetContent className="w-full sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Doctor Connect</SheetTitle>
          <SheetDescription>
            Find and connect with doctors, nurses, and volunteers across the
            various departments and teams.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 mt-4">
          {isPending ? (
            <div className="flex items-center justify-center h-64 gap-2">
              <Loader2 className="animate-spin size-5" />
              <p>Loading organizations</p>
            </div>
          ) : (
            organizations?.results
              ?.filter((organization) => organization.level_cache === 0)
              .map((organization) => (
                <OrganizationCollapsible
                  key={organization.id}
                  facilityId={encounter.facility.id}
                  organization={organization}
                />
              ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
