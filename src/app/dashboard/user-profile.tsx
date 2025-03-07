import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserProfile() {
  // Mock user data
  const user = {
    id: "USR12345",
    username: "johndoe",
    name: "John Doe",
    apartment: "A-1203",
    gender: "Male",
    phone: "+84 123 456 789",
    email: "john.doe@example.com",
    photoUrl: "/placeholder.svg",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.photoUrl} alt={user.name} />
              <AvatarFallback>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Badge variant="outline" className="px-3 py-1">
              ID: {user.id}
            </Badge>
          </div>

          <div className="flex-1 grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Username
              </p>
              <p className="text-sm font-medium">{user.username}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Full Name
              </p>
              <p className="text-sm font-medium">{user.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Apartment Number
              </p>
              <p className="text-sm font-medium">{user.apartment}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Gender
              </p>
              <p className="text-sm font-medium">{user.gender}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Phone
              </p>
              <p className="text-sm font-medium">{user.phone}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Email
              </p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
