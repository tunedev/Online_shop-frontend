import Reset from "../components/Reset";

const ResetPage = ({ query }) => (
  <div>
    <p>Reset your Password {query.resetToken}</p>
    <Reset resetToken={query.resetToken} />
  </div>
);

export default ResetPage;
