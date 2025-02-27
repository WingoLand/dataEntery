import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

export default function SearchBar({ data }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(
      data?.map((wordItem) =>
        wordItem.word.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data]); // Re-run filtering when search term or words list changes

  return (
    <Form className="mb-4">
      <Form.Control
        type="text"
        placeholder="Search words..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </Form>
  );
}
