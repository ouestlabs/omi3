import { FileIcon } from "lucide-react";
import {
  SiCss3,
  SiJavascript,
  SiJson,
  SiReact,
  SiTypescript,
} from "react-icons/si";
export function getIconForLanguageExtension(language: string) {
  switch (language) {
    case "json":
      return <SiJson />;
    case "css":
      return <SiCss3 />;
    case "jsx":
    case "tsx":
      return <SiReact />;
    case "js":
    case "javascript":
      return <SiJavascript />;
    case "ts":
    case "typescript":
      return <SiTypescript />;

    default:
      return <FileIcon />;
  }
}
