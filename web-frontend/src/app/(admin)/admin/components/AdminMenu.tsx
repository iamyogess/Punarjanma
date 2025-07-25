import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  image?: string;
  name: string;
};
export default function AdminMenu({ image, name }: Props) {
  return (
    <Avatar>
      <AvatarImage src={image} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
