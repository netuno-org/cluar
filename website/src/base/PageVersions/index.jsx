import React, { useState, useEffect } from "react";

import { Drawer, Tag, Button, Timeline, Flex, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { Link } from "react-router";

import { useSearchParams } from "react-router";

import dayjs from "dayjs";

import _service from "@netuno/service-client";

const PageVersions = ({ pageData, open, onClose }) => {
  const [versions, setVersions] = useState([]);
  const [totalVersions, setTotalVersions] = useState(0);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState([]);
  const [searchParams] = useSearchParams();

  const onDeleteVersion = (uid) => {
    if (uid) {
      setDeleting([...deleting, uid]);
      _service({
        url: "/editor/page-version",
        method: "DELETE",
        data: {
          uid,
        },
        success: (res) => {
          const updatedVersion = versions.filter((item) => item.uid !== uid);
          const updatedDeleting = deleting.filter((item) => item.uid !== uid);
          setVersions(updatedVersion);
          setDeleting(updatedDeleting);
        },
        fail: (error) => {
          console.error(error);
        },
      });
    }
  };

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
            <Flex align="center" gap={8}>
              <Link to={`?version=${version.uid}`}>
                {`${version.version} - ${dayjs(
                  version.created_at,
                  "YYYY-MM-DD HH:mm:ss"
                ).format("DD/MM/YYYY [às] HH:mm")}`}{" "}
                {version.uid === searchParams.get("version") ||
                (!searchParams.has("version") &&
                  version.code === "published") ? (
                  <Tag color="orange">Atual</Tag>
                ) : null}{" "}
                {version.code === "published" && (
                  <Tag color="green">Publicada</Tag>
                )}
              </Link>
              <Popconfirm
                description="Deseja remover esta versão?"
                onConfirm={() => onDeleteVersion(version.uid)}
                okText="Sim"
                cancelText="Não"
              >
                <Button
                  disabled={
                    version.uid === searchParams.get("version") ||
                    version.code === "published" ||
                    deleting.some((item) => item === version.uid)
                  }
                  type="text"
                >
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Flex>
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
