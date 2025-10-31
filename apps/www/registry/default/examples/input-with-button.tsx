import { Button } from "@/registry/default/ui/button";
import { Input } from "@/registry/default/ui/input";

export default function InputWithButton() {
  return (
    <div className="flex gap-2">
      <Input aria-label="Email" placeholder="you@example.com" type="email" />
      <Button variant="outline">Send</Button>
    </div>
  );
}
