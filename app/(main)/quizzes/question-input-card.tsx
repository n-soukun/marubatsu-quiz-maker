import { useSortable } from "@dnd-kit/react/sortable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CircleIcon,
  XIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";

export interface QuestionInputCardProps {
  id: string;
  index: number;
  text: string;
  answer: boolean;
  isLast: boolean;
  onChange: (text: string, answer: boolean) => void;
  onDelete: () => void;
  onReorder: (from: number, to: number) => void;
}

export function QuestionInputCard({
  id,
  index,
  text,
  answer,
  isLast,
  onChange,
  onDelete,
  onReorder,
}: QuestionInputCardProps) {
  const [element, setElement] = useState<Element | null>(null);
  const { isDragging } = useSortable({ id, index, element });
  return (
    <Card ref={setElement} className={isDragging ? "opacity-50" : ""} size="sm">
      <CardHeader>
        <CardTitle>問題{index + 1}</CardTitle>
        <CardAction className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onReorder(index, index - 1)}
            disabled={index === 0}
          >
            <ChevronUpIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onReorder(index, index + 1)}
            disabled={isLast}
          >
            <ChevronDownIcon />
          </Button>
          <div className="mr-2"></div>
          <Button variant="destructive" size="icon" onClick={onDelete}>
            <TrashIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel>問題文</FieldLabel>
          <Input
            type="text"
            placeholder="問題文"
            value={text}
            onChange={(e) => onChange(e.target.value, answer)}
          />
        </Field>
        <Field className="mt-4">
          <FieldLabel>答え</FieldLabel>
          <RadioGroup
            defaultValue="option-one"
            className="flex items-center space-x-4 w-fit"
            value={answer ? "true" : "false"}
            onValueChange={(value) => onChange(text, value === "true")}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="true" id="option-true" />
              <Label htmlFor="option-true">
                <CircleIcon className="text-green-500" />
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="false" id="option-false" />
              <Label htmlFor="option-false">
                <XIcon className="text-red-500" />
              </Label>
            </div>
          </RadioGroup>
        </Field>
      </CardContent>
    </Card>
  );
}
