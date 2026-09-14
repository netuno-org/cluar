import Default from "./Default";

function Row(props) {
  let rowLayout = null;

  if (props.type === "Default") {
    rowLayout = <Default {...props} />;
  } else {
    rowLayout = <Default {...props} />;
  }

  return <section className="row">{rowLayout}</section>;
}

export default Row;
