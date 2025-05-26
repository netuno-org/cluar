import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Switch,
    notification
} from "antd";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState
} from "react";
import _service from "@netuno/service-client";
import Cluar from "../../../../common/Cluar";

const PageModal = forwardRef(({ onReloadTable, pageData }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState({
        saving: false,
        languages: false,
        pages: false
    });
    const [languages, setLanguages] = useState([]);
    const [pages, setPages] = useState([]);
    const editeMode = pageData ? true : false;
    const [formRef] = Form.useForm();

    const onOpenModal = () => {
        setIsModalOpen(true);
    }

    const onLoadLanguages = () => {
        setLoading({ ...loading, languages: true });
        _service({
            url: "language/list",
            method: "POST",
            success: (response) => {
                setLoading({ ...loading, languages: false });
                const { items } = response.json.page;
                setLanguages(items);
            },
            fail: (error) => {
                setLoading({ ...loading, languages: false });
                console.error(error);
                notification.error({
                    message: "Falha ao carregar idiomas."
                })
            }
        })
    }

    const onLoadPages = (languageCode) => {
        if (!languageCode) return;
        
        setLoading({ ...loading, pages: true });
        _service({
            url: "page/list",
            method: "POST",
            data: {
                filters: {
                    language_code: languageCode
                }
            },
            success: (response) => {
                setLoading({ ...loading, pages: false });
                const { items } = response.json.page;
                setPages(items.filter(page => !pageData || page.uid !== pageData.uid));
            },
            fail: (error) => {
                setLoading({ ...loading, pages: false });
                console.error(error);
                notification.error({
                    message: "Falha ao carregar páginas."
                })
            }
        })
    }

    const onFinish = (values) => {
        const data = {
            ...values,
            parent_uid: values.parent_uid?.value || "",
            language_code: values.language_code?.value
        }

        if (editeMode) {
            setLoading({ ...loading, saving: true });
            _service({
                url: "page",
                method: "PUT",
                data: {
                    ...data,
                    uid: pageData.uid
                },
                success: (response) => {
                    setLoading({ ...loading, saving: false });
                    setIsModalOpen(false);
                    onReloadTable();
                    notification.success({
                        message: Cluar.plainDictionary('page-form-edit-success-message')
                    });
                },
                fail: (error) => {
                    setLoading({ ...loading, saving: false });
                    console.log(error);

                    if (error?.json?.error_code) {
                        notification.error({
                            message: Cluar.plainDictionary('page-form-edit-failed-message'),
                            description: Cluar.plainDictionary(error.json.error_code)
                        });
                        return;
                    }
                    notification.error({
                        message: Cluar.plainDictionary('page-form-edit-failed-message')
                    });
                }
            })
        } else {
            setLoading({ ...loading, saving: true });
            _service({
                url: "page",
                method: "POST",
                data: {
                    ...data
                },
                success: (response) => {
                    setLoading({ ...loading, saving: false });
                    setIsModalOpen(false);
                    onReloadTable();
                    notification.success({
                        message: Cluar.plainDictionary('page-form-save-success-message')
                    });
                },
                fail: (error) => {
                    setLoading({ ...loading, saving: false });
                    console.log(error);

                    if (error?.json?.error_code) {
                        notification.error({
                            message: Cluar.plainDictionary('page-form-save-failed-message'),
                            description: Cluar.plainDictionary(error.json.error_code)
                        });
                        return;
                    }
                    notification.error({
                        message: Cluar.plainDictionary('page-form-save-failed-message')
                    });
                }
            })
        }
    }

    useImperativeHandle(ref, () => {
        return {
            openModal: onOpenModal
        }
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            onLoadLanguages();
            
            if (editeMode) {
                formRef.setFieldsValue({
                    ...pageData,
                    language_code: pageData.language ? {
                        label: pageData.language.description,
                        value: pageData.language.code
                    } : undefined,
                    parent_uid: pageData.parent ? {
                        label: pageData.parent.title,
                        value: pageData.parent.uid
                    } : undefined
                });
                
                if (pageData.language?.code) {
                    onLoadPages(pageData.language.code);
                }
            }
        }
    }, [isModalOpen]);

    const handleLanguageChange = (value) => {
        onLoadPages(value.value);
    };

    return (
        <Modal
            title={editeMode ? Cluar.plainDictionary('page-modal-edit-title') : Cluar.plainDictionary('page-modal-new-title')}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onClose={() => setIsModalOpen(false)}
            destroyOnClose
            maskClosable={false}
            afterClose={() => formRef.resetFields()}
            centered
            footer={[
                <Button onClick={() => setIsModalOpen(false)}>
                    {Cluar.plainDictionary('page-form-cancel')}
                </Button>,
                <Button type="primary" onClick={() => formRef.submit()} loading={loading.saving} disabled={loading.saving}>
                    {Cluar.plainDictionary('page-form-save')}
                </Button>
            ]}
        >
            <Form
                layout="vertical"
                form={formRef}
                onFinish={onFinish}
            >
                <Row justify={"space-between"} align={"middle"} gutter={[10, 0]} >
                    <Col span={24}>
                        <Form.Item
                            name="language_code"
                            label={Cluar.plainDictionary('page-form-language')}
                            rules={[{ required: true, message: Cluar.plainDictionary('page-form-validate-message-required') }]}
                        >
                            <Select
                                labelInValue
                                options={languages.map((language) => ({
                                    label: language.description,
                                    value: language.code
                                }))}
                                loading={loading.languages}
                                onChange={handleLanguageChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label={Cluar.plainDictionary('page-form-title')}
                            rules={[{ required: true, message: Cluar.plainDictionary('page-form-validate-message-required') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label={Cluar.plainDictionary('page-form-description')}
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="keywords"
                            label={Cluar.plainDictionary('page-form-keywords')}
                        >
                            <Input.TextArea rows={2} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="link"
                            label={Cluar.plainDictionary('page-form-link')}
                            rules={[{ required: true, message: Cluar.plainDictionary('page-form-validate-message-required') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="parent_uid"
                            label={Cluar.plainDictionary('page-form-parent')}
                        >
                            <Select
                                labelInValue
                                allowClear
                                options={pages.map((page) => ({
                                    label: page.title,
                                    value: page.uid
                                }))}
                                loading={loading.pages}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="menu"
                            label={Cluar.plainDictionary('page-form-menu')}
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="navigable"
                            label={Cluar.plainDictionary('page-form-navigable')}
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="menu_title"
                            label={Cluar.plainDictionary('page-form-menu-title')}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
})

export default PageModal;