import { FacilityUser } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatUserName, toast } from "@/lib/utils";
import { Clipboard, MessageCircleMore, Phone } from "lucide-react";
import { formatPhoneNumberIntl } from "react-phone-number-input";

type UserCardProps = {
  user: FacilityUser;
};

export default function UserCard({ user: facilityUser }: UserCardProps) {
  const user = facilityUser.user;
  const userFullName = formatUserName(user);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profile_picture_url} alt={userFullName} />
            <AvatarFallback>{userFullName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col flex-1 min-w-0 gap-2.5">
            <div className="flex items-center gap-x-2 flex-wrap">
              <h4 className="font-medium text-base truncate min-w-28">
                {userFullName}
              </h4>
              <div className="text-xs font-medium">
                {facilityUser.role.name}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDate(user.last_login, true)}
            </p>
          </div>

          <div className="flex flex-col flex-1 min-w-0 items-center">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="Call"
                onClick={() => {
                  window.open(`tel:${user.phone_number}`);
                }}
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="WhatsApp"
                onClick={() => {
                  window.open(`https://wa.me/${user.phone_number}`);
                }}
              >
                <MessageCircleMore className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(user.phone_number);
                toast.success("Phone number copied to clipboard");
              }}
              className="text-xs text-muted-foreground whitespace-nowrap flex gap-1 items-center"
            >
              <Clipboard className="h-2.5 w-2.5" />
              {formatPhoneNumberIntl(user.phone_number)}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
