import React, { useEffect, useState } from "react";

import { Alert, Row, Col, Button, message } from "antd";

import { useSearchParams } from "react-router";

import _auth from "@netuno/auth-client";

import sal from "sal.js";

import Cluar from "../common/Cluar";

import PageSection from "../base/PageSection";
import Banner from "../components/Banner";
import Content from "../components/Content";
import Listing from "../components/Listing";
import Functionality from "../components/Functionality";
import Slider from "../components/Slider";
import AdminBar from "../base/AdminBar";

import { useNavigate } from "react-router";

import _service from "@netuno/service-client";

function Builder({ page }) {
  const [error, setError] = useState(false);
  const [structure, setStructure] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [hasDiff, setHasDiff] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [pageVersionExists, setPageVersionExists] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [currentPageVersion, setCurrentPageVersion] = useState(page?.page_version_uid);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasDiff || canPublish) {
      setShowActionButtons(true);
    } else {
      setShowActionButtons(false);
    }
  }, [hasDiff, canPublish]);

  useEffect(() => {
    setPageVersionExists(!hasDiff);
  }, [hasDiff]);

  useEffect(() => {
    console.log("pageVersionExists", pageVersionExists);
    console.log("currentPageVersion", currentPageVersion);
  }, [pageVersionExists]);

  useEffect(() => {
    // Verifica se o currentPageVersion é diferente da publicada
    if (currentPageVersion !== page?.page_version_uid && hasDiff == false) {
      setHasDiff(false);
      setCanPublish(true);
      setEditMode(true);
    } else {
      setHasDiff(false);
      setCanPublish(false);
      setEditMode(false);
    }
  }, [currentPageVersion]);

  useEffect(() => {
    if (searchParams.get("version")) {
      _service({
        url: "/editor/page-version",
        method: "GET",
        data: {
          version: searchParams.get("version"),
        },
        success: (res) => {
          if (res.json.result) {
            setStructure(res.json.structure);
            setCurrentPageVersion(searchParams.get("version"));
            setPageVersionExists(true);
          }
        },
        fail: (res) => {
          console.log(res);
        },
      });
    } else {
      fetch(`/cluar/structures/${page.uid}.json?time=${new Date().getTime()}`)
        .then((response) => response.json())
        .then((data) => {
          setError(false);
          setStructure(data);
          setHasDiff(false);
          setCurrentPageVersion(page?.page_version_uid);
          setPageVersionExists(true);
        })
        .catch((error) => {
          setError(true);
          console.error("Failed to load page structure: ", { page, error });
        });
    }
    document.getElementsByTagName("meta")["keywords"].content = page.keywords;
    document.getElementsByTagName("meta")["description"].content =
      page.description;
    document.title = page.title + " | " + Cluar.config().name;
  }, [page, searchParams]);

  const handleAddNewSection = (data, current) => {
    const index = structure.findIndex((item) => item.uid === current);

    if (index !== -1) {
      const structureBefore = structure[index];
      let newStructure = [...structure];
      newStructure.splice(index + 1, 0, {
        ...data,
        sorter: structureBefore.sorter ? structureBefore.sorter + 1 : 10,
      });
      newStructure = newStructure
        .sort((a, b) => a.sorter - b.sorter)
        .map((item, index) => ({ ...item, sorter: (index + 1) * 10 }));
      setStructure([...newStructure]);
    } else {
      const newStructure = [{ ...data, sorter: 1 }, ...structure]
        .sort((a, b) => a.sorter - b.sorter)
        .map((item, index) => ({ ...item, sorter: (index + 1) * 10 }));
      setStructure([...newStructure]);
    }
    setHasDiff(true);
    setCanPublish(true);
  };

  const handleChangeSection = (data, current) => {
    const index = structure.findIndex((item) => item.uid === current);

    if (index !== -1) {
      let newStructure = [...structure];
      newStructure[index] = data;
      newStructure = newStructure
        .sort((a, b) => a.sorter - b.sorter)
        .map((item, index) => ({ ...item, sorter: (index + 1) * 10 }));

      setStructure([...newStructure]);
      setHasDiff(true);
      setCanPublish(true);
    }
  };

  const handleSavePage = () => {
    setSaving(true);
    _service({
      url: "/editor/page-version/save",
      method: "POST",
      data: {
        structures: structure.filter((item) => item.status !== "to_remove"),
        page: page.uid,
      },
      success: (res) => {
        if (res.json.result) {
          const data = res.json['data'];
          setCurrentPageVersion(data.page_version_uid);

          message.success("Página guardada com sucesso");
          setHasDiff(false);
        }
        navigate(`?version=${res.json.data?.page_version_uid}`);
        setHasDiff(false);
        setSaving(false);
      },
      fail: (error) => {
        message.error("Falha ao guardar página");
        console.log(error);
        setSaving(false);
      },
    });
  };

  const handlePublishPage = () => {
    setPublishing(true);

    _service({
      url: "/editor/page-version/save/publish",
      method: "POST",
      data: {
        page: page.uid,
        page_version: currentPageVersion
      },
      success: (res) => {
        if (res.json.result) {
          message.success("Página publicada com sucesso");
        }
        setPublishing(false);
        setHasDiff(false);
        setCanPublish(false);
      },
      fail: (error) => {
        message.error("Falha ao publicar página");
        console.log(error);
        setPublishing(false);
      },
    });
  };

  /*const handleSetEditMode = (mode) => {
    setEditMode(mode);
    console.log("mode", mode);
    setShowActionButtons(mode);

    if (mode && (hasDiff || canPublish)) {
      setShowActionButtons(true);
    } else if (!mode) {
      setShowActionButtons(false);
    }
  };*/

  const extraBarAdmin = (
    <Row gutter={12}>
      <Col>
        <Button onClick={handleSavePage} loading={saving} disabled={!hasDiff}>
          Guardar
        </Button>
      </Col>
      <Col>
        <Button type="primary" onClick={handlePublishPage} loading={publishing} disabled={!canPublish}>
          Publicar
        </Button>
      </Col>
    </Row>
  );

  useEffect(() => {
    sal({
      threshold: 1,
      once: false,
    });
  }, [structure]);

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

  const handleSetEditMode = (mode) => {
    setEditMode(mode);
    setShowActionButtons(mode);
  }

  return (
    <main>
      {_auth.isLogged() && (
        <AdminBar
          onChangeEditMode={handleSetEditMode}
          extra={showActionButtons && extraBarAdmin}
          pageData={page}
          currentStructure={structure.filter(
            (item) => item.status !== "to_remove"
          )}
        />
      )}
      <PageSection
        editMode={editMode}
        onNewSection={handleAddNewSection}
      ></PageSection>
      {structure
        .filter((item) => item.status !== "to_remove")
        .map((item, index) => {
          let SectionComponent;

          switch (item.section) {
            case "banner":
              SectionComponent = <Banner {...item} />;
              break;
            case "content":
              SectionComponent = <Content {...item} />;
              break;
            case "listing":
              SectionComponent = <Listing {...item} />;
              break;
            case "slider":
              SectionComponent = <Slider {...item} />;
              break;
            case "functionality":
              SectionComponent = <Functionality {...item} />;
              break;
            default:
              SectionComponent = null;
          }

          return (
            <div key={item.uid}>
              <PageSection
                sectionData={item}
                onNewSection={(data) => handleAddNewSection(data, item.uid)}
                onConfirmChanges={(data) => handleChangeSection(data, item.uid)}
                onRemoveSection={(data) => handleChangeSection(data, item.uid)}
                editMode={editMode}
                sortArrowsVisible={true}
                disableSortUp={index === 0}
                disableSortDown={index === structure.length - 1}
                onSortDown={(data) =>
                  handleChangeSection(
                    { ...data, sorter: data.sorter + 11 },
                    item.uid
                  )
                }
                onSortUp={(data) =>
                  handleChangeSection(
                    { ...data, sorter: data.sorter - 11 },
                    item.uid
                  )
                }
              >
                {SectionComponent}
              </PageSection>
            </div>
          );
        })}
    </main>
  );
}

export default Builder;
