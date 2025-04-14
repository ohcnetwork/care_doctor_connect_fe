import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Clipboard, Phone } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, formatUserName, toast } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { FacilityUser } from "@/types/user";
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <h4 className="font-medium text-base truncate">
                      {userFullName}
                    </h4>
                  </TooltipTrigger>
                  <TooltipContent>{userFullName}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
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
