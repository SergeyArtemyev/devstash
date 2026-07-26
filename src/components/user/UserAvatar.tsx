import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Just the session-user fields the avatar needs, so this works with anything
// user-shaped (session user, DB row) without dragging in the full type.
export interface AvatarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// "Brad Traversy" -> "BT". Falls back to the local part of the email for
// OAuth-less accounts that never set a name (e.g. "demo@devstash.io" -> "D").
export function getInitials(user: AvatarUser): string {
  const source = user.name?.trim() || user.email?.split("@")[0] || "";
  const words = source.split(/[\s._-]+/).filter(Boolean);

  if (words.length === 0) return "?";

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function UserAvatar({
  user,
  size = "default",
  className,
}: {
  user: AvatarUser;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  return (
    <Avatar size={size} className={className}>
      {/* AvatarFallback renders whenever there is no image or it fails to load. */}
      {user.image && (
        <AvatarImage src={user.image} alt={user.name ?? "User avatar"} />
      )}
      <AvatarFallback className="font-medium">
        {getInitials(user)}
      </AvatarFallback>
    </Avatar>
  );
}
