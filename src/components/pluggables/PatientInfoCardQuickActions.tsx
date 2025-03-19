import { FC } from "react";
import { Encounter } from "@/types/encounter";
import DoctorConnectSheet from "@/components/DoctorConnectSheet";

type PatientInfoCardQuickActionsProps = {
  encounter: Encounter;
  className?: string;
};

const PatientInfoCardQuickActions: FC<PatientInfoCardQuickActionsProps> = ({
  encounter,
}) => {
  return <DoctorConnectSheet encounter={encounter} />;
};

export default PatientInfoCardQuickActions;
