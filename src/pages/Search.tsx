import { useState } from "react";
import Home from "./Home";

export default function Search() {
  const [searchText, setSearchText] = useState("");

  const onChangeSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <Home isSearch onChangeSearch={onChangeSearch} searchText={searchText} />
  );
}
