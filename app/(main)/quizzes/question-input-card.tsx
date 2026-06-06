import { useSortable } from "@dnd-kit/react/sortable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CircleIcon, XIcon, TrashIcon, GripVerticalIcon } from "lucide-react";
import { useRef, useState } from "react";

export interface QuestionInputCardProps {
  id: string;
  index: number;
  text: string;
  answer: boolean;
  onChange: (text: string, answer: boolean) => void;
  onDelete: () => void;
}

export function QuestionInputCard({
  id,
  index,
  text,
  answer,
  onChange,
  onDelete,
}: QuestionInputCardProps) {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({ id, index, element, handle: handleRef });
  return (
    <Card ref={setElement} className={isDragging ? "opacity-50" : ""}>
      <CardContent className="flex gap-4 items-center">
        <button ref={handleRef} className="cursor-move">
          <GripVerticalIcon />
        </button>
        <div className="w-16 text-center">{index + 1}問目</div>
        <Input
          type="text"
          placeholder="問題文"
          value={text}
          onChange={(e) => onChange(e.target.value, answer)}
        />
        <RadioGroup
          defaultValue="option-one"
          className="ml-4 flex items-center space-x-4 w-fit"
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
        <Button variant="destructive" onClick={onDelete}>
          <TrashIcon />
          削除
        </Button>
      </CardContent>
    </Card>
  );
}
