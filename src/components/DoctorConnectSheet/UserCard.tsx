import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Copy, Phone, UserRound, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, formatUserName, toast } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { FacilityUser } from "@/types/user";
import { I18NNAMESPACE } from "@/lib/constants";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type UserCardProps = {
  user: FacilityUser;
};

type MSLaunchURI = (
  uri: string,
  successCB?: null | (() => void),
  noHandlerCB?: null | (() => void)
) => void;

export default function UserCard({ user: facilityUser }: UserCardProps) {
  const { t } = useTranslation(I18NNAMESPACE);

  const user = facilityUser.user;
  const userFullName = formatUserName(user);
  const [copied, setCopied] = useState(false);

  function connectOnWhatsApp(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!user.phone_number) return;
    const phoneNumber = user.phone_number?.replace(/\D+/g, "");
    const message = t("whatsapp_chat_start_message", {
      userName: userFullName,
      encounterLink: window.location.href,
    });
    const encodedMessage = encodeURIComponent(message);
    const whatsappAppURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    const whatsappWebURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    const userAgent = navigator.userAgent;
    const isEdge = /edge\/\d+/i.test(userAgent);
    const isMobileFirefoxOrSafari =
      /iPhone|iPad|iPod|Android/i.test(userAgent) &&
      (/Firefox/i.test(userAgent) ||
        (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)));
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

    const openWhatsAppWebFallback = () => {
      if (isMobile) {
        toast.warning(t("whatsapp_not_installed"));
      }
      window.open(whatsappWebURL, "_blank");
    };

    if (isEdge) {
      if ("msLaunchUri" in navigator) {
        const launch = navigator.msLaunchUri as MSLaunchURI;
        launch(whatsappAppURL, null, openWhatsAppWebFallback);
      } else {
        openWhatsAppWebFallback();
      }
    } else {
      const attemptOpenWhatsApp = (url: string) => {
        if (isMobileFirefoxOrSafari || isSafari) {
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = url;
          document.body.appendChild(iframe);
        } else {
          window.location.href = url;
        }
      };

      attemptOpenWhatsApp(whatsappAppURL);

      const fallbackTimeout = setTimeout(() => {
        openWhatsAppWebFallback();
      }, 1250);

      window.addEventListener("blur", () => {
        clearTimeout(fallbackTimeout);
      });
    }
  }

  return (
    <TooltipProvider>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.profile_picture_url} alt={userFullName} />
              <AvatarFallback>{userFullName[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full flex justify-start cursor-default">
                    <h4 className="font-medium text-base truncate">
                      {userFullName}
                    </h4>
                  </TooltipTrigger>
                  <TooltipContent>{userFullName}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="text-sm font-light flex gap-2 mt-1 items-center">
                <UserRound className="h-3 w-3" />
                {facilityUser.role.name}
              </div>
              <div className="flex items-center text-sm font-light text-muted-foreground mt-1 gap-2">
                <CalendarDays className="h-3 w-3" />
                <span>{formatDate(user.last_login, true)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 border-green-500/20"
                    onClick={() =>
                      window.open(`tel:${user.phone_number.replace(/\s/g, "")}`)
                    }
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("call")}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 border-green-500/20 text-primary hover:text-primary"
                    onClick={connectOnWhatsApp}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("whatsapp")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-t">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium flex-1">
              {formatPhoneNumberIntl(user.phone_number)}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full transition-all duration-200 ${
                    copied
                      ? "text-green-600 bg-green-50 hover:bg-green-100"
                      : "hover:bg-background"
                  }`}
                  onClick={() => {
                    navigator.clipboard.writeText(user.phone_number);
                    toast.success(t("phone_number_copied"));
                    setCopied(true);
                  }}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? t("copied") : t("copynumber")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
