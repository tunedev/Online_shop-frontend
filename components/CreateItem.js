import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import ErrorMessage from "./ErrorMessage";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Item from "./styles/ItemStyles";

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $price: Int!
    $description: String!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

const CreateItem = () => {
  const [state, setState] = useState({
    title: "",
    description: "",
    price: 0,
  });
  // const [description, setDescription] = useState(
  //   "Its a customized ps4 pad, play with style"
  // );
  const [image, setImage] = useState("");
  const [largeImage, setLargeImage] = useState("");
  // const [price, setPrice] = useState(1000);
  const [createItem, { loading, error }] = useMutation(CREATE_ITEM_MUTATION);

  const handleChange = (event) => {
    const { name, type, value } = event.target;
    const val = type === "number" ? parseInt(value || 0, 10) : value;
    setState((state) => ({ ...state, [name]: val }));
  };

  const uploadFile = async (event) => {
    const files = event.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/swissdevchi/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();

    setImage(file.secure_url);
    setLargeImage(file.eager[0].secure_url);
  };

  const { title, price, description } = state;
  return (
    <div>
      {
        <Form
          onSubmit={async (event) => {
            event.preventDefault();
            // Stop form from submitting
            const res = await createItem({
              variables: { title, description, image, largeImage, price },
            });
            // Call the Mutation
            // Change them to the single item page
            Router.push({
              pathname: "/item",
              query: { id: res.data.createItem.id },
            });
          }}
        >
          <ErrorMessage error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input
                type="file"
                id="file"
                name="file"
                placeholder="Upload an Image"
                required
                onChange={uploadFile}
              />
              {image && <img width="200" src={image} alt={"Image preview"} />}
            </label>
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                required
                value={title}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="price">
              Price
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price"
                required
                value={price}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="description">
              Description
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                required
                value={description}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      }
    </div>
  );
};

export default CreateItem;
