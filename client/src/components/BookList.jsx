import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_BOOKS = gql`
  {
    books {
      name
      genre
      id
    }
  }
`;

const BookList = () => {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <ul>
      {data.books.map(book => (
        <li key={book.id}> {book.name} </li>
      ))}
    </ul>
  );
};

export default BookList;
