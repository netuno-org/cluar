import React, { useState, useEffect, useRef } from "react";

import {
    Drawer,
    Form,
    Input,
    Button,
    Switch,
    notification,
    Select,
    Flex,
    Tag,
    message
} from "antd";
import _service from "@netuno/service-client";
import Cluar from "../../common/Cluar";
import { useSearchParams } from "react-router";
import dayjs from "dayjs";
import './index.less';

const ClonePage = ({ pageData, open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState({
        saving: false,
        languages: false,
        versions: false,
    });
    const [versions, setVersions] = useState([]);
    const [versionsPage, setVersionsPage] = useState(1);
    const [totalVersions, setTotalVersions] = useState(0);
    const [languages, setLanguages] = useState([]);
    const [searchParams] = useSearchParams();
    const defaultVersionSetRef = useRef(false);

    const isCurrentVersion = (version) =>
        version.uid === searchParams.get("version") ||
        (!searchParams.has("version") && version.code === "published");

    const onLoadLanguages = () => {
        setLoading((prev) => ({ ...prev, languages: true }));
        _service({
            url: "language/list",
            method: "POST",
            success: (response) => {
                setLoading((prev) => ({ ...prev, languages: false }));
                const { items } = response.json.page;
                setLanguages(items);
            },
            fail: (error) => {
                setLoading((prev) => ({ ...prev, languages: false }));
                console.error(error);
                notification.error({ message: "Falha ao carregar idiomas." });
            },
        });
    };

    const onLoadVersions = (page = 1) => {
        setLoading((prev) => ({ ...prev, versions: true }));
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
                setLoading((prev) => ({ ...prev, versions: false }));
                if (res.json.result) {
                    setVersions((prev) =>
                        page === 1 ? res.json.versions : [...prev, ...res.json.versions]
                    );
                    setTotalVersions(res.json.total_versions);
                }
            },
            fail: (error) => {
                setLoading((prev) => ({ ...prev, versions: false }));
                console.error(error);
                notification.error({ message: "Falha ao carregar versões." });
            },
        });
    };

    const handleVersionsPopupScroll = (event) => {
        const { target } = event;
        const reachedBottom =
            target.scrollTop + target.offsetHeight >= target.scrollHeight - 20;

        if (reachedBottom && !loading.versions && versions.length < totalVersions) {
            const nextPage = versionsPage + 1;
            setVersionsPage(nextPage);
            onLoadVersions(nextPage);
        }
    };

    useEffect(() => {
        if (open && pageData?.uid) {
            form.resetFields();
            onLoadLanguages();
            onLoadVersions(1);
        }
    }, [open, pageData, form]);

    useEffect(() => {
        if (versions.length > 0 && !defaultVersionSetRef.current) {
            const currentVersion = versions.find(isCurrentVersion);
            if (currentVersion) {
                form.setFieldValue("page_version_uid", {
                    value: currentVersion.uid,
                    label: currentVersion.version,
                });
                defaultVersionSetRef.current = true;
            }
        }
    }, [versions]);

    useEffect(() => {
        if (!open) {
            form.resetFields();
            setVersions([]);
            setVersionsPage(1);
            setTotalVersions(0);
            defaultVersionSetRef.current = false;
            setLoading({ saving: false, languages: false, versions: false });
        }
    }, [open]);

    const handleSave = () => {
        form.validateFields().then((values) => {
            setLoading((prev) => ({ ...prev, saving: true }));

            const cleanLink = (values.link || "").replace(/^\/+|\/+$/g, '');
            const normalizedLink = cleanLink === "" ? "/" : `/${cleanLink}`;
            const data = {
                source_uid: pageData.uid,
                title: values.title,
                link: normalizedLink,
                language_code: values.language_code?.value,
                page_version_uid: values.page_version_uid?.value,
                published: values.published,
            };

            _service({
                url: "page/clone",
                method: "POST",
                data,
                success: (response) => {
                    setLoading((prev) => ({ ...prev, saving: false }));
                    notification.success({ message: "Página clonada com sucesso." });

                    if (onClose) onClose();
                    if (onSuccess) onSuccess(response);

                    const { link, language_code } = response.json;

                    if (link && language_code) {
                        const path = link.startsWith("/") ? link : `/${link}`;

                        window.location.href = `/${language_code}${path}`;
                    } else {
                        window.location.reload();
                    }
                },
                fail: (error) => {
                    setLoading((prev) => ({ ...prev, saving: false }));
                    console.error(error);

                    const errorCode = error?.json?.error_code;
                    notification.error({
                        message: errorCode
                            ? Cluar.plainDictionary(errorCode)
                            : "Falha ao clonar página.",
                    });
                },
            });
        });
    };

    const isRootLink = pageData?.link === "/";

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width={520}
            destroyOnClose
            title="Clonar Página"
            extra={
                <Button type="primary" onClick={handleSave} loading={loading.saving}>
                    Clonar
                </Button>
            }
        >
            <Form layout="vertical" form={form}>
                <Form.Item
                    label={Cluar.plainDictionary("page-form-title")}
                    name="title"
                    rules={[{ required: true, message: "Por favor, insira o título da página" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={Cluar.plainDictionary("page-form-link")}
                    name="link"
                    rules={[{ required: true, message: "Por favor, insira o link da página" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Idioma"
                    name="language_code"
                    tooltip="Selecione o idioma da nova página"
                    rules={[
                        {
                            required: true,
                            message: Cluar.plainDictionary("page-form-validate-message-required"),
                        },
                    ]}
                >
                    <Select
                        placeholder="Selecione um idioma"
                        optionFilterProp="label"
                        showSearch
                        labelInValue
                        loading={loading.languages}
                        options={languages.map((language) => ({
                            label: language.description,
                            value: language.code,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Versão"
                    name="page_version_uid"
                    tooltip="Selecione a versão da página a ser clonada"
                >
                    <Select
                        placeholder="Selecione uma versão"
                        optionFilterProp="label"
                        showSearch
                        labelInValue
                        loading={loading.versions}
                        onPopupScroll={handleVersionsPopupScroll}
                        options={versions.map((version) => ({
                            label: version.version,
                            value: version.uid,
                        }))}
                        optionRender={(option) => {
                            const version = versions.find((item) => item.uid === option.value);
                            if (!version) return option.label;
                            return (
                                <Flex align="center" justify="space-between" gap={8}>
                                    <span>
                                        {version.version} —{" "}
                                        {dayjs(version.created_at, "YYYY-MM-DD HH:mm:ss").format(
                                            "DD/MM/YYYY [às] HH:mm"
                                        )}
                                    </span>
                                    <Flex gap={4}>
                                        {isCurrentVersion(version) && (
                                            <Tag color="orange">Atual</Tag>
                                        )}
                                        {version.code === "published" && (
                                            <Tag color="green">Publicada</Tag>
                                        )}
                                    </Flex>
                                </Flex>
                            );
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Publicada"
                    name="published"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default ClonePage;