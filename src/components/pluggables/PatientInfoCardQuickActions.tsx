import { FC } from "react";
import { Encounter } from "@/types/encounter";
import DoctorConnectSheet from "@/components/DoctorConnectSheet";

export type PatientInfoCardQuickActionsProps = {
  encounter: Encounter;
  className?: string;
  __meta?: {
    url?: string;
    name?: string;
    config?: {
      allowed_facility_organizations?: string[];
      allowed_filter_roles?: string[];
    };
    [key: string]: unknown;
  };
};

const PatientInfoCardQuickActions: FC<PatientInfoCardQuickActionsProps> = (
  props
) => {
  return (
    <div className="doctor-connect-container w-full md:w-auto">
      <DoctorConnectSheet {...props} />
    </div>
  );
};

export default PatientInfoCardQuickActions;
