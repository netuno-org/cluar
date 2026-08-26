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
import { useRef, useState } from "react";
import _service from "@netuno/service-client";
import Cluar from "../../../../../common/Cluar";
import "./index.less";

const emptyDraft = { code: "", description: "" };
const VISIBLE_STEP = 20; // quantidade exibida por vez, expande ao clicar em "ver mais"

const DictionaryEntrySelect = ({
  value,
  onChange,
  entries,
  loading,
  onEntriesChange,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [visibleCount, setVisibleCount] = useState(VISIBLE_STEP);

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

  const filteredEntries = entries.filter((entry) => {
    if (!searchValue) return true;
    const term = searchValue.toLowerCase();
    return (
      entry.code?.toLowerCase().includes(term) ||
      entry.description?.toLowerCase().includes(term)
    );
  });

  const exactMatch = entries.some(
    (entry) => entry.code?.toLowerCase() === searchValue.toLowerCase()
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
      url: "reserved-area/dictionary/entry",
      method: "POST",
      data: createDraft,
      success: (response) => {
        const newEntry = response.json.entry;
        onEntriesChange((prev) => [...prev, newEntry]);
        onChange?.(newEntry.code);
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

  const startEdit = (entry) => {
    setCreating(false);
    setEditingUid(entry.uid);
    setEditDraft({ code: entry.code, description: entry.description });
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
      url: "reserved-area/dictionary/entry",
      method: "PUT",
      data: { uid, ...editDraft },
      success: () => {
        onEntriesChange((prev) =>
          prev.map((e) => (e.uid === uid ? { ...e, ...editDraft } : e))
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

  const deleteEntry = (entry) => {
    _service({
      url: "reserved-area/dictionary/entry",
      method: "DELETE",
      data: { uid: entry.uid },
      success: () => {
        onEntriesChange((prev) => prev.filter((e) => e.uid !== entry.uid));
        if (value === entry.code) onChange?.(undefined);
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
        if (newOpen) {
          setVisibleCount(VISIBLE_STEP);
        }
      }}
      showSearch
      searchValue={searchValue}
      onSearch={(v) => {
        setSearchValue(v);
        setVisibleCount(VISIBLE_STEP);
      }}
      filterOption={false}
      loading={loading}
      placeholder={Cluar.plainDictionary("dictionary-form-entry-placeholder")}
      options={filteredEntries.length > 0
        ? filteredEntries.map((e) => ({
          value: e.code,
          label: `${e.description}`,
        }))
        : [{ value: "__empty__", label: "empty", disabled: true }] // Opção fantasma
      }
      onChange={(code) => {
        onChange?.(code);
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
            {filteredEntries.length === 0 && !creating && (
              <div className="dictionary-parameter-select-empty">
                {Cluar.plainDictionary("dictionary-parameter-select-empty")}
              </div>
            )}
            {filteredEntries.slice(0, visibleCount).map((entry) =>
              editingUid === entry.uid ? (
                <div className="dictionary-parameter-select-row editing" key={entry.uid}>
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
                  <Space size={4} style={{ alignSelf: "flex-end" }}>
                    <Button
                      size="small"
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={() => saveEdit(entry.uid)}
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
                  className={`dictionary-parameter-select-row ${value === entry.code ? "selected" : ""
                    }`}
                  key={entry.uid}
                  onClick={() => {
                    onChange?.(entry.code);
                    setSearchValue("");
                    setOpen(false);
                  }}
                >
                  <span className="dictionary-parameter-select-label">
                    {entry.description}
                  </span>
                  <Space size={4} className="dictionary-parameter-select-actions">
                    <Button
                      size="small"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(entry);
                      }}
                    />
                    <Popconfirm
                      title={Cluar.plainDictionary("dictionary-parameter-select-popconfirm-delete-title")}
                      onConfirm={(e) => {
                        e?.stopPropagation?.();
                        deleteEntry(entry);
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
            {filteredEntries.length > visibleCount && (
              <Button
                type="link"
                size="small"
                block
                onClick={() => setVisibleCount((prev) => prev + VISIBLE_STEP)}
              >
                Ver mais ({filteredEntries.length - visibleCount} restantes)
              </Button>
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

export default DictionaryEntrySelect;
