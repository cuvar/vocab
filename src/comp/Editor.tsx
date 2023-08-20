import { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import { useAtom } from "jotai";
import { addModalIdAtom, toastTextAtom, toastTypeAtom } from "../server/store";

export default function Editor() {
  const iwordenRef = useRef(null);
  const iworddeRef = useRef(null);
  const inotesRef = useRef(null);
  const ibusinessRef = useRef(null);

  const [wordToGet, setWordToGet] = useState("");
  const [_, setToastText] = useAtom(toastTextAtom);
  const [__, setToastType] = useAtom(toastTypeAtom);
  const [addModal, ___] = useAtom(addModalIdAtom);

  const addWordMutation = api.word.addWord.useMutation();
  const getWordQuery = api.word.getWord.useQuery(
    {
      word: wordToGet,
    },
    {
      enabled: false,
      onSuccess: (data) => {
        setWordToDisplay({ ...data });
        // @ts-ignore
        iwordenRef.current.value = "";
        setWordToGet("");
      },
      onError: (err) => {
        setToastType("error");
        setToastText("No word wound");
        setTimeout(() => {
          setToastText("");
        }, 1500);
      },
    }
  );

  const [wordToDisplay, setWordToDisplay] = useState<VocabularyWord | null>(
    null
  );

  useEffect(() => {
    if (wordToGet == "") return;
    getWordQuery.refetch();
  }, [wordToGet]);

  function addWord() {
    // @ts-ignore
    const english = iwordenRef.current?.value ?? "";
    // @ts-ignore
    const german = iworddeRef.current?.value ?? "";
    // @ts-ignore
    const notes = inotesRef.current?.value ?? "";
    // @ts-ignore
    const c1business = ibusinessRef.current?.checked + "" ?? "";

    if (english == "" || german == "") {
      return;
    }

    addWordMutation.mutate({
      english: english,
      german: german,
      notes: notes,
      c1business: c1business,
    });

    if (addWordMutation.error) {
      alert("wrong data");
      return;
    }
    // @ts-ignore
    iwordenRef.current.value = "";
    // @ts-ignore
    iworddeRef.current.value = "";
    // @ts-ignore
    inotesRef.current.value = "";
    // @ts-ignore
    ibusinessRef.current.checked = false;
  }

  function getWord() {
    // @ts-ignore
    const english = iwordenRef.current?.value ?? "";

    if (english == "") {
      return;
    }

    setWordToGet(english);
  }

  return (
    //   <div className="flex flex-col space-y-8">
    //     <div className="flex space-x-2">
    //       <div className="flex flex-col justify-evenly space-y-2">
    //         <label htmlFor="worden">English</label>
    //         <label htmlFor="wordde">German</label>
    //         <label htmlFor="notes">Notes</label>
    //         <label htmlFor="business">Business</label>
    //       </div>
    //       <div className="flex flex-col justify-evenly space-y-2">
    //         <input
    //           ref={iwordenRef}
    //           type="text"
    //           name="worden"
    //           className="rounded-md py-2 px-2"
    //         />
    //         <input
    //           ref={iworddeRef}
    //           type="text"
    //           name="wordde"
    //           className="rounded-md py-2 px-2"
    //         />
    //         <input
    //           ref={inotesRef}
    //           type="text"
    //           name="notes"
    //           className="rounded-md py-2 px-2"
    //         />
    //         <input
    //           ref={ibusinessRef}
    //           type="checkbox"
    //           name="business"
    //           className="rounded-md py-2 px-2 pt-8"
    //           value={"Business"}
    //           placeholder="Business"
    //         />
    //       </div>
    //     </div>
    //     <div className="flex justify-between space-x-2">
    //       <button
    //         className="rounded-lg border-2 border-[#135770] px-4 py-2 text-xl hover:shadow-lg active:bg-[#135770] active:text-white"
    //         onClick={() => {
    //           addWord();
    //         }}
    //       >
    //         Add Word
    //       </button>
    //       <button
    //         className="rounded-lg border-2 border-[#135770] px-4 py-2 text-xl hover:shadow-lg active:bg-[#135770] active:text-white"
    //         onClick={() => {
    //           getWord();
    //         }}
    //       >
    //         Get Word
    //       </button>
    //     </div>
    //     {/* <button
    //   className="rounded-lg border-2 border-[#135770] px-4 py-2 text-xl hover:shadow-lg active:bg-[#135770] active:text-white"
    //   onClick={() => {
    //     initDB.mutate();
    //   }}
    // >
    //   Init db
    // </button> */}
    //   </div>
    <dialog id={addModal} className="modal">
      <form method="dialog" className="modal-box">
        <button className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2">
          ✕
        </button>
        <h3 className="text-lg font-bold">Add word</h3>
        <p className="py-4">Press ESC key or click on ✕ button to close</p>
      </form>
    </dialog>
  );
}
