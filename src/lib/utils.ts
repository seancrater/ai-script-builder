import { clsx, type ClassValue } from "clsx";
import type { Element } from "hast";
import type { Html, Root, RootContent, Text } from "mdast";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import { twMerge } from "tailwind-merge";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function rehypeAddPositionPlugin() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.position) {
        node.properties = {
          ...node.properties
        }
      }
    })
  }
}

export const remarkFunctionBadgeTagPlugin = () => {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      const regex = /<% function ([a-z0-9-]{36}) %>/gi
      const matches = [...node.value.matchAll(regex)]
      if (!matches.length) return

      const newNodes: RootContent[] = []
      let lastIndex = 0

      for (const match of matches) {
        const [fullMatch, id] = match
        const start = match.index!
        const end = start + fullMatch.length

        // Add preceding text
        if (start > lastIndex) {
          newNodes.push({
            type: 'text',
            value: node.value.slice(lastIndex, start),
          })
        }

        // Custom node to be rendered with a custom component
        newNodes.push({
          type: 'functionBadge' as 'html',
          value: '',
          data: {
            hName: 'FunctionBadge',
            hProperties: { id },
          },
          position: node.position
        })

        lastIndex = end
      }

      // Remaining text
      if (lastIndex < node.value.length) {
        newNodes.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        })
      }

      parent!.children.splice(index!, 1, ...newNodes)
    })
  }
}

export function remarkSerializeFunctionBadgeTag() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Html, index, parent) => {
      // @ts-ignore
      const match = node?.properties?.dataType === 'function-badge';
      if (match && parent && index) {
        parent.children[index] = {
          type: 'paragraph',
          children: [{
            type: 'text',
            // @ts-ignore
            value: `<% function ${node?.properties?.dataId} %>`
          }]
        }
      }
    })
  }
}

function fixBreakSerialization() {
  return (tree: Root) => {
    visit(tree, 'break', (node) => {
      // Convert `break` to an `html` node to ensure Markdown renderer handles it
      // @ts-ignore
      node.type = 'html'
      // @ts-ignore
      node.value = '\n'
    })
  }
}

export async function parseHTMLToMarkdown(input: string) {
  const file = await unified()
    .use(remarkSerializeFunctionBadgeTag) // Convert Function Badge to Function Tag
    .use(rehypeParse, { fragment: true }) // Parse HTML to HAST
    .use(rehypeRemark)                    // Convert HAST to MDAST
    .use(fixBreakSerialization)           // Handle line breaks correctly
    .use(remarkStringify, {
      bullet: '-', // list formatting
      fences: true,
      rule: '-',   // horizontal rules
      listItemIndent: 'one', // 'tab' or 'mixed' sometimes collapse spacing
    })
    .process(input)

  return String(file)
}