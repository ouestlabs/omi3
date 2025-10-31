import { Label } from "@/registry/default/ui/label";
import { Switch } from "@/registry/default/ui/switch";

export default function SwitchWithLabel() {
  return (
    <Label>
      <Switch disabled />
      Marketing emails
    </Label>
  );
}
