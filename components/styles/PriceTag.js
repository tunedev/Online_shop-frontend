import styled from "styled-components";

const PriceTag = styled.span`
  background: ${(props) => props.theme.primary};
  transform: rotate(3deg);
  color: white;
  font-weight: 400;
  padding: 5px;
  margin: 15px auto;
  width: 50%;
  line-height: 1;
  font-size: 1.5rem;
  display: inline-block;
  position: absolute;
  top: -3px;
  right: -3px;
`;

export default PriceTag;
