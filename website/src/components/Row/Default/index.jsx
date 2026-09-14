import { useState, useEffect } from "react";

import { Row, Col, Flex, Typography } from "antd";
import PageSection from "../../../base/PageSection";

import Banner from "../../Banner";
import Content from "../../Content";
import Listing from "../../Listing";
import Functionality from "../../Functionality";
import Slider from "../../Slider";
import CluarRow from "../../Row";

import "./index.less";

const Default = ({ title, items }) => {
  const [itemsComponent, setItemsComponent] = useState([...items]);

  console.log("itemsComponent", itemsComponent);

  const handleAddItem = (columnUid, sectionData) => {
    let arrItems = [...itemsComponent];
    const columnIndex = arrItems.findIndex((item) => item.uid === columnUid);

    if (columnIndex !== -1) {
      arrItems[columnIndex].section = sectionData;
      setItemsComponent([...arrItems]);
    }
  };

  const handleRemoveSection = (columnUid) => {
    const updatedItems = itemsComponent.map((item) => {
      if (item.uid === columnUid) {
        return { ...item, section: null };
      }
      return item;
    });

    setItemsComponent([...updatedItems]);
  };

  const handleChangeSection = (columnUid, sectionData) => {
    const updatedItems = itemsComponent.map((item) => {
      if (item.uid === columnUid) {
        return { ...item, section: sectionData };
      }
      return item;
    });

    setItemsComponent([...updatedItems]);
  };

  useEffect(() => {
    setItemsComponent([...items]);
  }, [items]);

  return (
    <div className="row__default">
      <Flex vertical gap={8}>
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
        <Typography.Paragraph>Descrição</Typography.Paragraph>
      </Flex>

      <Row style={{ width: "100%" }}>
        {itemsComponent.map((item) => {
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

          return (
            <Col {...item}>
              {SectionComponent ? (
                <PageSection
                  showAddSectionButton={false}
                  sectionData={sectionItem}
                  editMode={true}
                  onRemoveSection={(data) => handleRemoveSection(item.uid)}
                  onConfirmChanges={(data) =>
                    handleChangeSection(item.uid, data)
                  }
                >
                  {SectionComponent}
                </PageSection>
              ) : (
                <PageSection
                  editMode={true}
                  onNewSection={(data) => handleAddItem(item.uid, data)}
                />
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Default;
