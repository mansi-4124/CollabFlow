import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useDebounce } from "../hooks/use-debounce";
import { searchUsers } from "../services/authService";
import type { IUser } from "../types/user.types";
import { addBoard } from "../services/boardService";

export default function AddBoardForm({
  refreshBoards,
}: {
  refreshBoards: () => void;
}) {
  const { currentProject } = useSelector((state: RootState) => state.project);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const [teamLeadSearchTerm, setTeamLeadSearchTerm] = useState("");
  const [selectedTeamLead, setSelectedTeamLead] = useState<IUser | null>(null);
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const debouncedTeamLeadSearchTerm = useDebounce(teamLeadSearchTerm, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      if (
        !debouncedTeamLeadSearchTerm ||
        debouncedTeamLeadSearchTerm.length < 2
      ) {
        setSearchResults([]);
        setIsSearchingUsers(false);
        return;
      }

      setIsSearchingUsers(true);
      try {
        const users = await searchUsers(debouncedTeamLeadSearchTerm);
        setSearchResults(users);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Failed to search users:", error);
        setSearchResults([]);
        toast.error("Failed to search for users.");
      } finally {
        setIsSearchingUsers(false);
      }
    };

    fetchUsers();
  }, [debouncedTeamLeadSearchTerm]);

  const handleTeamLeadInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setTeamLeadSearchTerm(value);
    setSelectedTeamLead(null);
  };

  const handleSelectTeamLead = (user: IUser) => {
    setSelectedTeamLead(user);
    setTeamLeadSearchTerm(user.email);
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and Description are required");
      return;
    }

    const data = {
      title,
      description,
      project: currentProject?._id,
      priority,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      deadline: deadline?.toISOString() || null,
      teamLead: selectedTeamLead?._id,
    };
    console.log(data);
    try {
      setIsSubmitting(true);
      await addBoard(data);
      toast.success("Board created successfully!", { duration: 3000 });
      refreshBoards();
      setOpen(false);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setTags("");
      setDeadline(undefined);
      setTeamLeadSearchTerm("");
      setSelectedTeamLead(null);
      setSearchResults([]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create board");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Add Board</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl">Create New Board</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details to create a board
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-150px)] grid gap-4"
        >
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Board Title"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Board Description"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Priority</label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5 relative">
            <label className="text-sm font-medium">
              Team Lead (Search by Email)
            </label>
            <Input
              type="text"
              value={teamLeadSearchTerm}
              onChange={handleTeamLeadInputChange}
              onFocus={() => {
                if (searchResults?.length > 0) setShowSearchResults(true);
              }}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              placeholder="Start typing email to search..."
            />
            {isSearchingUsers && teamLeadSearchTerm?.length >= 2 && (
              <div className="absolute z-10 top-[calc(100%+4px)] left-0 w-full bg-popover border border-border rounded-md shadow-lg p-2 text-sm text-muted-foreground">
                Searching...
              </div>
            )}
            {showSearchResults &&
              searchResults?.length > 0 &&
              !isSearchingUsers && (
                <ul className="absolute z-10 top-[calc(100%+4px)] left-0 w-full bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((user) => (
                    <li
                      key={user._id}
                      className="p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground flex justify-between items-center"
                      onMouseDown={() => handleSelectTeamLead(user)}
                    >
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            {showSearchResults &&
              searchResults?.length === 0 &&
              teamLeadSearchTerm?.length >= 2 &&
              !isSearchingUsers && (
                <div className="absolute z-10 top-[calc(100%+4px)] left-0 w-full bg-popover border border-border rounded-md shadow-lg p-2 text-sm text-muted-foreground">
                  No users found.
                </div>
              )}
            {selectedTeamLead && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected:{" "}
                <span className="font-medium">
                  {selectedTeamLead.name} ({selectedTeamLead.email})
                </span>
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Deadline</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? (
                    format(deadline, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  disabled={(date) =>
                    date < new Date() ||
                    date >
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1)
                      )
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium">
              Tags (comma-separated)
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. UI, urgent, backend"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Board"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
