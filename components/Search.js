import React from "react";
import Downshift from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "@apollo/react-hooks";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const AutoComplete = () => {
  return (
    <SearchStyles>
      <input type="search" />
      <DropDown>
        <p>Items would go here</p>
      </DropDown>
    </SearchStyles>
  );
};

export default AutoComplete;
