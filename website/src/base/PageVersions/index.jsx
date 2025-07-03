import React, { useState, useEffect } from "react";

import { Drawer, Tag, Button, Timeline } from "antd";

import { Link } from "react-router";

import { useSearchParams } from "react-router";

import dayjs from "dayjs";

import _service from "@netuno/service-client";

const PageVersions = ({ pageData, open, onClose }) => {
  const [versions, setVersions] = useState([]);
  const [totalVersions, setTotalVersions] = useState(0);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (pageData.uid && open) {
      _service({
        url: "editor/page-version/list",
        method: "POST",
        data: {
          page_uid: pageData.uid,
          pagination: {
            size: 24,
            page,
          },
        },
        success: (res) => {
          if (res.json.result) {
            setVersions([...versions, ...res.json.versions]);
            setTotalVersions(res.json.total_versions);
          }
        },
        fail: (error) => {
          console.log(error);
        },
      });
    }
  }, [page, open]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        onClose();
        setPage(1);
        setVersions([]);
      }}
      width={520}
      title="Versões da Página"
    >
      <Timeline
        items={versions.map((version) => ({
          children: (
            <Link to={`?version=${version.uid}`}>
              {`${version.version} - ${dayjs(
                version.created_at,
                "YYYY-MM-DD HH:mm:ss"
              ).format("DD/MM/YYYY [às] HH:mm")}`}{" "}
              {version.uid === searchParams.get("version") ||
              (!searchParams.has("version") && version.code === "published") ? (
                <Tag color="orange">Atual</Tag>
              ) : null}{" "}
              {version.code === "published" && (
                <Tag color="green">Publicada</Tag>
              )}
            </Link>
          ),
          color: version.code === "draft" ? "gray" : "green",
        }))}
      />
      {totalVersions > versions.length && versions.length > 0 && (
        <Button onClick={() => setPage(page + 1)}>Carregar Mais</Button>
      )}
    </Drawer>
  );
};

export default PageVersions;
