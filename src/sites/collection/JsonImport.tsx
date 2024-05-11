import { useState } from "react";
import { api } from "../../lib/api";
import { useToast } from "../../lib/ui/hooks";

type Props = {
  collectionId: string;
};

export default function JsonImport(props: Props) {
  const [jsonInput, setJsonInput] = useState("");

  const showToast = useToast();

  const importWordsMutation = api.word.importWords.useMutation({
    onSuccess: (count) =>
      showToast(`Successfully imported ${count} words`, "success"),
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  function handleImport() {
    importWordsMutation.mutate({
      text: jsonInput,
      collectionId: props.collectionId,
    });
  }
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="mt-5 mb-2 text-2xl tracking-tight">JSON import</h1>
      <div className="flex w-full flex-col items-center space-y-4">
        <div className="collapse bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            Required format
          </div>
          <div className="collapse-content">
            <code>
              [&#123;
              <br />
              &nbsp;&nbsp;&quot;front&quot;: &quot;abundant&quot;,
              <br />
              &nbsp;&nbsp;&quot;back&quot;: &quot;reichlich&quot;,
              <br />
              &nbsp;&nbsp;&quot;notes&quot;: &quot;any notes you want to have
              for your entry&quot;,
              <br />
              &nbsp;&nbsp;&quot;mode&quot;:
              &quot;LEARNED&quot;|&quot;UNLEARNED&quot;|&quot;ARCHIVED&quot;,
              <br />
              &#125;]
            </code>
          </div>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-lg">JSON Input</span>
          </label>
          <textarea
            placeholder="Data"
            className="textarea-bordered textarea w-full font-mono"
            value={jsonInput}
            rows={20}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-end space-x-4">
          <button className="btn-secondary btn" onClick={handleImport}>
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
