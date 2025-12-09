import { useState } from "react";
import axios from "axios";

export const useWordSummary = () => {
  const [bubbleText, setBubbleText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const requestSummary = async ({ word, sentence}) => {
    if (!word && !sentence) return;

    setIsLoading(true);

    try {
      const res = await axios.get("/util/word-meaning", {
        params: { word, sentence },
      });
      setBubbleText(res.data);
    } catch (err) {
      console.error(err);
      setErrorMessage("요약을 불러오는 데 실패했습니다.");
    } finally {
        setIsLoading(false);
    }
  };
  

  const clearSummary = () => {
    setBubbleText("");
    setErrorMessage("");
    setIsLoading(false);
  };

  return {
    bubbleText,
    isLoading,
    errorMessage,
    requestSummary,
    clearSummary,
  };
};
