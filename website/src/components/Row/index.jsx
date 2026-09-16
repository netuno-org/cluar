import { useState, useEffect } from "react";

import Default from "./Default";

import Banner from "../Banner";
import Content from "../Content";
import Listing from "../Listing";
import Functionality from "../Functionality";
import Slider from "../Slider";
import CluarRow from "../Row";

function Row(props) {
  const [itemsComponent, setItemsComponent] = useState([...props.items]);

  const handleAddItem = (columnUid, sectionData) => {
    let arrItems = [...itemsComponent];
    const columnIndex = arrItems.findIndex((item) => item.uid === columnUid);

    if (columnIndex !== -1) {
      arrItems[columnIndex].section = sectionData;
      props.onUpdateRow({ ...props, items: arrItems });
      // setItemsComponent([...arrItems]);
    }
  };

  const handleRemoveSection = (columnUid) => {
    const updatedItems = itemsComponent.map((item) => {
      if (item.uid === columnUid) {
        return { ...item, section: null };
      }
      return item;
    });
    props.onUpdateRow({ ...props, items: updatedItems });
    // setItemsComponent([...updatedItems]);
  };

  const handleChangeSection = (columnUid, sectionData) => {
    const updatedItems = itemsComponent.map((item) => {
      if (item.uid === columnUid) {
        return { ...item, section: sectionData };
      }
      return item;
    });

    props.onUpdateRow({ ...props, items: updatedItems });
    // setItemsComponent([...updatedItems]);
  };

  const renderColumnSection = (columnUid) => {
    const item = itemsComponent.find((i) => i.uid === columnUid);
    let sectionItem = item?.section;
    let SectionComponent;

    switch (sectionItem?.section) {
      case "banner":
        SectionComponent = <Banner {...sectionItem} />;
        break;
      case "content":
        SectionComponent = <Content {...sectionItem} />;
        break;
      case "listing":
        SectionComponent = <Listing {...sectionItem} />;
        break;
      case "slider":
        SectionComponent = <Slider {...sectionItem} />;
        break;
      case "row":
        SectionComponent = <CluarRow {...sectionItem} />;
        break;
      case "functionality":
        SectionComponent = <Functionality {...sectionItem} />;
        break;
      default:
        SectionComponent = null;
    }

    return SectionComponent;
  };

  useEffect(() => {
    setItemsComponent([...props.items]);
  }, [props.items]);

  let rowLayout = null;

  if (props.type === "Default") {
    rowLayout = (
      <Default
        {...props}
        onConfirmChanges={handleChangeSection}
        onNewSection={handleAddItem}
        onRemoveSection={handleRemoveSection}
        itemsComponent={itemsComponent}
        renderColumnSection={renderColumnSection}
      />
    );
  } else {
    rowLayout = (
      <Default
        {...props}
        onConfirmChanges={handleChangeSection}
        onNewSection={handleAddItem}
        onRemoveSection={handleRemoveSection}
        itemsComponent={itemsComponent}
        renderColumnSection={renderColumnSection}
      />
    );
  }

  return <section className="row">{rowLayout}</section>;
}

export default Row;
