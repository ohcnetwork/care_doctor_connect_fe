import { Encounter } from "@/types/encounter";
import { Button } from "@/components/ui/button";

type DoctorConnectSheetProps = {
  encounter: Encounter;
};

export default function DoctorConnectSheet({
  encounter,
}: DoctorConnectSheetProps) {
  if (!encounter) {
    return null;
  }

  return <Button>Doctor Connect</Button>;
}
