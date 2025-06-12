import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/userSlice";
import { cn } from "../lib/utils";
import { SearchBar } from "./search-bar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
export default function DashboardHeader() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call logout API here if needed
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between w-full px-4 py-2 shadow-md border-b",
        "bg-[--sidebar] text-[--sidebar-foreground] rounded-b-md"
      )}
    >
      {/* Logo */}
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        CollabFlow
      </h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <SearchBar />
      </div>

      {/* Avatar Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 rounded-full">
            <Avatar>
              <AvatarImage
                src={user?.avatar || "https://github.com/shadcn.png"}
                alt={user?.name || "User"}
              />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
