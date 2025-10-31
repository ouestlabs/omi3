import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/registry/default/ui/accordion";

const items = [
  {
    id: "1",
    title: "What is Base UI?",
    content:
      "Base UI is a library of high-quality unstyled React components for design systems and web apps.",
  },
  {
    id: "2",
    title: "How do I get started?",
    content:
      "Head to the \"Quick start\" guide in the docs. If you've used unstyled libraries before, you'll feel at home.",
  },
  {
    id: "3",
    title: "Can I use it for my project?",
    content: "Of course! Base UI is free and open source.",
  },
];

export default function AccordionDemo() {
  return (
    <Accordion className="w-full" defaultValue={["3"]}>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionPanel>{item.content}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
