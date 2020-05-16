import React, { useState } from "react";
import Downshift, { resetIdCounter } from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "@apollo/react-hooks";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($search_term: String!) {
    items(
      where: {
        OR: [
          { title_contains: $search_term }
          { description_contains: $search_term }
        ]
      }
    ) {
      id
      title
      image
    }
  }
`;

const routeToItem = (item) => {
  Router.push({
    pathname: "/item",
    query: { id: item.id },
  });
};

const AutoComplete = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = debounce(async (e, client) => {
    // Turn loading on
    setLoading(true);
    // Manually query Apollo client
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { search_term: e.target.value },
    });
    setItems(res.data.items);
    setLoading(false);
  }, 350);

  resetIdCounter();
  return (
    <SearchStyles>
      <Downshift
        onChange={routeToItem}
        itemToString={(item) => (item === null ? "" : item.title)}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <ApolloConsumer>
              {(client) => (
                <input
                  {...getInputProps({
                    type: "search",
                    placeholder: "Search for an Item",
                    id: "search",
                    className: loading ? "loading" : "",
                    onChange: (e) => {
                      e.persist();
                      handleChange(e, client);
                    },
                  })}
                />
              )}
            </ApolloConsumer>
            {isOpen && (
              <DropDown>
                {items.map((item, index) => (
                  <DropDownItem
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
                {!items.length && !loading && (
                  <DropDownItem>Nothing found for {inputValue}</DropDownItem>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
};

export default AutoComplete;
