import { Input } from "./ui/input";

export function SearchBar() {
  return (
    <div className="w-full">
      <Input
        type="text"
        placeholder="Search..."
        className="rounded-md bg-[--input] text-[--foreground] border border-[--border] shadow-sm"
      />
    </div>
  );
}
