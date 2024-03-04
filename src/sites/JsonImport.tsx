import { useAtom } from "jotai";
import { useState } from "react";
import { api } from "../../server/api/api";
import { toastTextAtom, toastTypeAtom } from "../../server/store";

export default function JsonImport() {
  const [jsonInput, setJsonInput] = useState("");
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);

  const importWordsMutation = api.word.importWords.useMutation({
    onSuccess: (count) => {
      setToastType("success");
      setToastText(`Successfully imported ${count} words`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
    onError: (err) => {
      setToastType("error");
      setToastText(`${err.message}`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
  });

  function handleImport() {
    importWordsMutation.mutate({
      text: jsonInput,
    });
  }
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="mb-2 mt-5 text-2xl tracking-tight">JSON import</h1>
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
              &quot;translation&quot;: &quot;abundant&quot;,
              <br />
              &quot;native&quot;: &quot;reichlich&quot;,
              <br />
              &quot;notes&quot;: &quot;&quot;,
              <br />
              &quot;mode&quot;: &quot;UNLEARNED&quot;,
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
            className="textarea textarea-bordered w-full font-mono"
            value={jsonInput}
            rows={20}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-end space-x-4">
          <button className="btn btn-secondary" onClick={handleImport}>
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
