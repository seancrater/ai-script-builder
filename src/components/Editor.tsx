import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import type { Node } from "unist";
import { FunctionBadge } from "@/components/FunctionBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { initialScript, functionSpecs } from "@/data";
import type { FunctionSpec } from "@/data";
import { parseHTMLToMarkdown, rehypeAddPositionPlugin, remarkFunctionBadgeTagPlugin } from "@/lib/utils";

export function Editor() {
  const priorState = localStorage.getItem('script');
  const [script, setScript] = useState(priorState || initialScript);
  const [updatedScript, setUpdatedScript] = useState(script)

  const handleDeleteFunction = (line: number) => {
    const splitScript = script.split('\n');
    splitScript.splice(line - 1, 1);
    const joinedScript = splitScript.join('\n');
    setScript(joinedScript);
  };

  const handleUpdateFunction = (line: number, spec: FunctionSpec) => {
    const splitScript = script.split('\n');
    splitScript.splice(line - 1, 1, `<% function ${spec.id} %>`);
    const joinedScript = splitScript.join('\n');
    setScript(joinedScript);
  };

  const handleSerializeMarkdown = async (input: string) => {
    const markdown = await parseHTMLToMarkdown(input)
    setUpdatedScript(markdown)
  }

  const handleSave = () => {
    localStorage.setItem('script', updatedScript)
    toast("Script has been saved successfully.")
  };

  return (
    <Card className="rounded-lg shadow-lg">
      <CardContent className="p-6">
        <div
          onInput={event => handleSerializeMarkdown((event.target as HTMLDivElement).innerHTML)}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[400px] w-full outline-none prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-700 prose-em:italic prose-ul:list-disc prose-ul:pl-4 prose-ol:list-decimal prose-ol:pl-4 prose-li:text-gray-700 prose-hr:border-gray-200 prose-hr:my-4"
          role="textbox"
          aria-label="Prompt editor"
        >
          <Markdown
            components={{
              // @ts-ignore
              FunctionBadge: ({ id, node, ...props }: { id: string, node: Node }) => {
                return (
                  <FunctionBadge
                    id={id}
                    node={node}
                    specs={functionSpecs}
                    handleDeleteFunction={handleDeleteFunction}
                    handleUpdateFunction={handleUpdateFunction}
                    {...props}
                  />
                )
              },
            }}
            rehypePlugins={[rehypeAddPositionPlugin]}
            remarkPlugins={[remarkFunctionBadgeTagPlugin]}
          >
            { script }
          </Markdown>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full justify-end">
          <Button onClick={handleSave}>
              Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
