import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { EditorHeader } from "@/components/EditorHeader";
import { Editor } from "@/components/Editor";

export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <Header />

      {/* Editor Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <EditorHeader />
          <Editor />
          <Toaster />
        </div>
      </section>
    </div>
  );
}
