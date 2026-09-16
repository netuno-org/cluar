import { Row, Col, Flex, Typography } from "antd";
import PageSection from "../../../base/PageSection";

import "./index.less";

const Default = ({
  title,
  content,
  onRemoveSection,
  onConfirmChanges,
  onNewSection,
  itemsComponent,
  renderColumnSection,
}) => {
  return (
    <div className="row__default">
      <Flex vertical gap={8}>
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </Flex>

      <Row style={{ width: "100%" }}>
        {itemsComponent?.map((item) => {
          let SectionComponent = renderColumnSection(item?.uid);

          return (
            <Col {...item} key={item.uid}>
              {SectionComponent ? (
                <PageSection
                  showAddSectionButton={false}
                  sectionData={item?.section}
                  editMode={true}
                  onRemoveSection={() => onRemoveSection(item.uid)}
                  onConfirmChanges={(data) => onConfirmChanges(item.uid, data)}
                >
                  {SectionComponent}
                </PageSection>
              ) : (
                <PageSection
                  editMode={true}
                  onNewSection={(data) => onNewSection(item.uid, data)}
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
