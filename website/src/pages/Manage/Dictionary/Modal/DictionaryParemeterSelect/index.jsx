import {
    Select,
    Input,
    Button,
    Space,
    Popconfirm,
    notification,
    Spin,
    Divider,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import _service from "@netuno/service-client";
import Cluar from "../../../../../common/Cluar";
import "./index.less";

const emptyDraft = { code: "", description: "" };

const DictionaryParameterSelect = ({ value, onChange }) => {
    const [parameters, setParameters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const [editingUid, setEditingUid] = useState(null);
    const [editDraft, setEditDraft] = useState(emptyDraft);

    const [creating, setCreating] = useState(false);
    const [createDraft, setCreateDraft] = useState(emptyDraft);

    // Evita que o dropdown feche quando o usuário clica/foca
    // em algo dentro do dropdownRender (inputs, botões, etc.)
    const skipCloseRef = useRef(false);

    const handleDropdownMouseDown = () => {
        skipCloseRef.current = true;
    };

    const handleDropdownMouseUp = () => {
        // libera a flag depois que o ciclo de blur/close já rodou
        setTimeout(() => {
            skipCloseRef.current = false;
        }, 0);
    };

    useEffect(() => {
        loadParameters();
    }, []);

    const loadParameters = () => {
        setLoading(true);
        _service({
            url: "dictionary/parameter/list",
            method: "POST",
            success: (response) => {
                setLoading(false);
                setParameters(response.json.data);
            },
            fail: (error) => {
                setLoading(false);
                console.error(error);
                notification.error({ message: Cluar.plainDictionary("dictionary-parameter-select-notification-load-fail") });
            },
        });
    };

    const filteredParameters = parameters.filter((parameter) => {
        if (!searchValue) return true;
        const term = searchValue.toLowerCase();
        return (
            parameter.code?.toLowerCase().includes(term) ||
            parameter.description?.toLowerCase().includes(term)
        );
    });

    const exactMatch = parameters.some(
        (parameter) => parameter.code?.toLowerCase() === searchValue.toLowerCase()
    );

    const startCreate = (prefillCode = "") => {
        setEditingUid(null);
        setCreateDraft({ code: prefillCode, description: "" });
        setCreating(true);
    };

    const cancelCreate = () => {
        setCreating(false);
        setCreateDraft(emptyDraft);
    };

    const saveCreate = () => {
        if (!createDraft.code || !createDraft.description) {
            notification.warning({ message: Cluar.plainDictionary("dictionary-parameter-select-notification-fill-required") });
            return;
        }
        _service({
            url: "dictionary/parameter",
            method: "POST",
            data: createDraft,
            success: (response) => {
                const newParameter = response.json.parameter;
                setParameters((prev) => [...prev, newParameter]);
                onChange?.(newParameter.uid);
                cancelCreate();
                setSearchValue("");
                setOpen(false);
            },
            fail: (error) => {
                console.error(error);
                notification.error({ message: Cluar.plainDictionary("dictionary-parameter-select-notification-create-fail") });
            },
        });
    };

    const startEdit = (parameter) => {
        setCreating(false);
        setEditingUid(parameter.uid);
        setEditDraft({ code: parameter.code, description: parameter.description });
    };

    const cancelEdit = () => {
        setEditingUid(null);
        setEditDraft(emptyDraft);
    };

    const saveEdit = (uid) => {
        if (!editDraft.code || !editDraft.description) {
            notification.warning({ message: Cluar.plainDictionary("dictionary-parameter-select-notification-fill-required") });
            return;
        }
        _service({
            url: "dictionary/parameter",
            method: "PUT",
            data: { uid, ...editDraft },
            success: () => {
                setParameters((prev) =>
                    prev.map((p) => (p.uid === uid ? { ...p, ...editDraft } : p))
                );
                cancelEdit();
                notification.success({
                    message: Cluar.plainDictionary("dictionary-parameter-select-notification-update-success")
                });
            },
            fail: (error) => {
                console.error(error);
                notification.error({ message: Cluar.plainDictionary("dictionary-parameter-select-notification-update-fail") });
            },
        });
    };

    const deleteParameter = (uid) => {
        _service({
            url: "dictionary/parameter",
            method: "DELETE",
            data: { uid },
            success: () => {
                setParameters((prev) => prev.filter((p) => p.uid !== uid));
                if (value === uid) onChange?.(undefined);
                notification.success({ message: Cluar.plainDictionary("dictionary-parameter-select-notification-delete-success") });
            },
            fail: (error) => {
                console.error(error);
                // Pega a mensagem de erro que veio do backend, se existir
                const errorMessage = error?.json?.error || Cluar.plainDictionary("dictionary-parameter-select-notification-delete-fail");
                notification.error({ message: errorMessage });
            },
        });
    };

    return (
        <Select
            className="dictionary-parameter-select"
            value={value}
            open={open}
            onOpenChange={(newOpen) => {
                if (!newOpen && skipCloseRef.current) {
                    return;
                }
                setOpen(newOpen);
            }}
            showSearch
            searchValue={searchValue}
            onSearch={setSearchValue}
            filterOption={false}
            placeholder={Cluar.plainDictionary("dictionary-form-parameter-placeholder")}
            options={filteredParameters.length > 0
                ? filteredParameters.map((p) => ({
                    value: p.uid,
                    label: `${p.code} — ${p.description}`,
                }))
                : [{ value: "__empty__", label: "empty", disabled: true }] // Opção fantasma
            }
            onChange={(uid) => {
                onChange?.(uid);
                setSearchValue("");
                setOpen(false);
            }}
            notFoundContent={loading ? <Spin size="small" /> : null}
            dropdownRender={() => (
                <div
                    onMouseDown={handleDropdownMouseDown}
                    onMouseUp={handleDropdownMouseUp}
                >
                    <div className="dictionary-parameter-select-list">
                        {filteredParameters.length === 0 && !creating && (
                            <div className="dictionary-parameter-select-empty">
                                {Cluar.plainDictionary("dictionary-parameter-select-empty")}
                            </div>
                        )}
                        {filteredParameters.map((parameter) =>
                            editingUid === parameter.uid ? (
                                <div className="dictionary-parameter-select-row editing" key={parameter.uid}>
                                    <Input
                                        size="small"
                                        value={editDraft.code}
                                        onChange={(e) =>
                                            setEditDraft({ ...editDraft, code: e.target.value })
                                        }
                                        placeholder={Cluar.plainDictionary("dictionary-parameter-select-placeholder-code")}
                                    />
                                    <Input
                                        size="small"
                                        value={editDraft.description}
                                        onChange={(e) =>
                                            setEditDraft({ ...editDraft, description: e.target.value })
                                        }
                                        placeholder={Cluar.plainDictionary("dictionary-parameter-select-placeholder-description")}
                                    />
                                    <Input
                                        size="small"
                                        value={editDraft.select}
                                        onChange={(e) =>
                                            setEditDraft({ ...editDraft, select: e.target.value })
                                        }
                                        placeholder={Cluar.plainDictionary("dictionary-parameter-select-placeholder-select")}
                                    />
                                    <Space size={4} style={{ alignSelf: "flex-end" }}>
                                        <Button
                                            size="small"
                                            type="text"
                                            icon={<CheckOutlined />}
                                            onClick={() => saveEdit(parameter.uid)}
                                        />
                                        <Button
                                            size="small"
                                            type="text"
                                            icon={<CloseOutlined />}
                                            onClick={cancelEdit}
                                        />
                                    </Space>
                                </div>
                            ) : (
                                <div
                                    className={`dictionary-parameter-select-row ${value === parameter.uid ? "selected" : ""
                                        }`}
                                    key={parameter.uid}
                                    onClick={() => {
                                        onChange?.(parameter.uid);
                                        setSearchValue("");
                                        setOpen(false);
                                    }}
                                >
                                    <span className="dictionary-parameter-select-label">
                                        <strong>{parameter.code}</strong> — {parameter.description}
                                    </span>
                                    <Space size={4} className="dictionary-parameter-select-actions">
                                        <Button
                                            size="small"
                                            type="text"
                                            icon={<EditOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEdit(parameter);
                                            }}
                                        />
                                        <Popconfirm
                                            title={Cluar.plainDictionary("dictionary-parameter-select-popconfirm-delete-title")}
                                            onConfirm={(e) => {
                                                e?.stopPropagation?.();
                                                deleteParameter(parameter.uid);
                                            }}
                                            onCancel={(e) => e?.stopPropagation?.()}
                                        >
                                            <Button
                                                size="small"
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Popconfirm>
                                    </Space>
                                </div>
                            )
                        )}
                    </div>

                    <Divider style={{ margin: "4px 0" }} />

                    {creating ? (
                        <div className="dictionary-parameter-select-row creating">
                            <Input
                                size="small"
                                value={createDraft.code}
                                onChange={(e) =>
                                    setCreateDraft({ ...createDraft, code: e.target.value })
                                }
                                placeholder={Cluar.plainDictionary("dictionary-parameter-select-placeholder-code")}
                            />
                            <Input
                                size="small"
                                value={createDraft.description}
                                onChange={(e) =>
                                    setCreateDraft({ ...createDraft, description: e.target.value })
                                }
                                placeholder={Cluar.plainDictionary("dictionary-parameter-select-placeholder-description")}
                            />
                            <Space size={4} style={{ alignSelf: "flex-end" }}>
                                <Button size="small" type="primary" onClick={saveCreate}>
                                    {Cluar.plainDictionary("dictionary-parameter-select-button-save")}
                                </Button>
                                <Button size="small" onClick={cancelCreate}>
                                    {Cluar.plainDictionary("dictionary-parameter-select-button-cancel")}
                                </Button>
                            </Space>
                        </div>
                    ) : (
                        <Button
                            type="text"
                            block
                            icon={<PlusOutlined />}
                            onClick={() => startCreate(!exactMatch ? searchValue : "")}
                        >
                            {searchValue && !exactMatch
                                ? `${Cluar.plainDictionary("dictionary-parameter-select-button-create")} "${searchValue}"`
                                : Cluar.plainDictionary("dictionary-parameter-select-button-new")}
                        </Button>
                    )}
                </div>
            )}
        />
    );
};

export default DictionaryParameterSelect;