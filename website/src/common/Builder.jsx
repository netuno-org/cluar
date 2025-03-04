import React, { useEffect, useState } from 'react';

import { Alert, Row, Col, Button } from "antd";

import {useParams} from "react-router-dom"

import sal from "sal.js";

import Cluar from "../common/Cluar";

import PageSection from "../base/PageSection";
import Banner from "../components/Banner";
import Content from "../components/Content";
import Listing from "../components/Listing";
import ContactForm from "../components/functionality/ContactForm";
import ContactMap from "../components/functionality/ContactMap";
import AdminBar from "../base/AdminBar";

function Builder({ page }) {
  const [error, setError] = useState(false);
  const [structure, setStructure] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [hasDiff, setHasDiff] = useState(false);
  const params = useParams()

  useEffect(() => {
    fetch(`/cluar/structures/${params.version || page.uid}.json?time=${new Date().getTime()}`)
      .then((response) => response.json())
      .then((data) => {
        setError(false);
        setStructure(data);
        setHasDiff(false);
      })
      .catch((error) => {
        setError(true);
        console.error("Failed to load page structure: ", { page, error });
      });
    document.getElementsByTagName("meta")["keywords"].content = page.keywords;
    document.getElementsByTagName("meta")["description"].content =
      page.description;
    document.title = page.title + " | " + Cluar.config().name;
  }, [page]);

  const handleAddNewSection = (data, current) => {
    const index = structure.findIndex((item) => item.uid === current);

    if (index !== -1) {
      const newStructure = [...structure];
      newStructure.splice(index + 1, 0, data);
      setStructure(newStructure);
    } else {
      setStructure([data, ...structure]);
    }
    setHasDiff(true);
  };

  const handleChangeSection = (data, current) => {
    const index = structure.findIndex((item) => item.uid === current);

    if (index !== -1) {
      const newStructure = [...structure];
      newStructure[index] = data;
      setStructure(newStructure);
      setHasDiff(true);
    }
  };

  const extraBarAdmin = (
    <Row gutter={12}>
      <Col>
        <Button>Guardar</Button>
      </Col>
      <Col>
        <Button type="primary">Publicar</Button>
      </Col>
    </Row>
  );

  useEffect(() => {
    sal({
      threshold: 1,
      once: false,
    });
  }, [structure]);

  const components = [];
  for (const item of structure) {
    const { uid } = item;
    if (item.status !== "to_remove") {
      if (item.section === "banner") {
        components.push(
          <PageSection
            sectionData={item}
            onNewSection={(data) => handleAddNewSection(data, uid)}
            onConfirmChanges={(data) => handleChangeSection(data, uid)}
            onRemoveSection={(data) => handleChangeSection(data, uid)}
            editMode={editMode}
          >
            <Banner key={uid} {...item} />
          </PageSection>
        );
      } else if (item.section === "content") {
        components.push(
          <PageSection
            sectionData={item}
            onNewSection={(data) => handleAddNewSection(data, uid)}
            onConfirmChanges={(data) => handleChangeSection(data, uid)}
            onRemoveSection={(data) => handleChangeSection(data, uid)}
            editMode={editMode}
          >
            <Content key={uid} {...item} />
          </PageSection>
        );
      } else if (item.section === "listing") {
        components.push(
          <PageSection
            sectionData={item}
            onNewSection={(data) => handleAddNewSection(data, uid)}
            onConfirmChanges={(data) => handleChangeSection(data, uid)}
            onRemoveSection={(data) => handleChangeSection(data, uid)}
            editMode={editMode}
          >
            <Listing key={uid} {...item} />
          </PageSection>
        );
      } else if (item.section === "functionality") {
        if (item.type === "contact-form") {
          components.push(
            <PageSection
              sectionData={item}
              onNewSection={(data) => handleAddNewSection(data, uid)}
              onConfirmChanges={(data) => handleChangeSection(data, uid)}
              onRemoveSection={(data) => handleChangeSection(data, uid)}
              editMode={editMode}
            >
              <ContactForm key={uid} {...item} />
            </PageSection>
          );
        } else if (item.type === "contact-map") {
          components.push(
            <PageSection
              sectionData={item}
              onNewSection={(data) => handleAddNewSection(data, uid)}
              onConfirmChanges={(data) => handleChangeSection(data, uid)}
              onRemoveSection={(data) => handleChangeSection(data, uid)}
              editMode={editMode}
            >
              <ContactMap key={uid} {...item} />
            </PageSection>
          );
        }
      }
    }
  }
  if (error) {
    return (
      <main>
        <Alert
          style={{
            maxWidth: "400px",
            width: "calc(100% - 20px)",
            margin: "50px auto 50px auto",
          }}
          message="Error"
          description="The page content could not be loaded."
          type="error"
          showIcon
        />
      </main>
    );
  }

  return (
    <main>
      <AdminBar
        onChangeEditMode={setEditMode}
        extra={hasDiff && extraBarAdmin}
        pageData={page}
      />
      <PageSection
        editMode={editMode}
        onNewSection={handleAddNewSection}
      ></PageSection>
      {components}
    </main>
  );
}

export default Builder;
