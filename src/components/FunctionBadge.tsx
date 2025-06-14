import { Check, X } from "lucide-react";
import { useMemo } from "react";
import type { Node } from "unist";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FunctionSpec } from "@/data";

export function FunctionBadge({ handleDeleteFunction, handleUpdateFunction, id, node, specs }: {
  handleDeleteFunction: (line: number) => void,
  handleUpdateFunction: (line: number, spec: FunctionSpec) => void,
  id: string,
  node: Node,
  specs: FunctionSpec[]
}) {
  const selectedFunctionSpec: FunctionSpec | undefined = useMemo(() => specs.find(spec => spec.id === id), [id])
  
  return (
    <div
      className="flex items-center"
      spellCheck={false}
      contentEditable={false}
      data-type="function-badge"
      data-id={id}
    >
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={'rounded-r-none px-2'}>
                {selectedFunctionSpec && selectedFunctionSpec.function_internal_id}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <TooltipContent>
            {selectedFunctionSpec?.description}
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent>
          {specs.map(functionSpec => (
            <DropdownMenuItem
              key={functionSpec.id}
              onClick={() => node.position && handleUpdateFunction(node.position.start.line, functionSpec)}
            >
              {functionSpec.function_internal_id === selectedFunctionSpec?.function_internal_id ? (
                <Check className="h-4 w-4" />
              ) : (
                <div className="w-4"></div>
              )}

              {functionSpec.function_internal_id}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog handleConfirm={() => node.position && handleDeleteFunction(node.position.start.line)}>
        <Button variant="outline" className={'rounded-l-none border-l-0'}>
          <X />
        </Button>
      </ConfirmDialog>
    </div>
  )
}