import { FC } from "react";
import { Encounter } from "@/types/encounter";
import DoctorConnectSheet from "@/components/DoctorConnectSheet";

export type PatientInfoCardQuickActionsProps = {
  encounter: Encounter;
  className?: string;
};

const PatientInfoCardQuickActions: FC<PatientInfoCardQuickActionsProps> = (
  props
) => {
  return <DoctorConnectSheet {...props} />;
};

export default PatientInfoCardQuickActions;
