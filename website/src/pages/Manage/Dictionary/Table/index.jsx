import _service from "@netuno/service-client";
import {
    Button,
    notification,
    Table
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import DictionaryModal from "../Modal";
import Cluar from "../../../../common/Cluar";

const DictionaryTable = forwardRef(({}, ref) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({});
    const [languages, setLanguages] = useState([]);
    const [dictionaryData, setDictionaryData] = useState(null);
    const dictionaryModalRef = useRef();
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10
    });
    const [loading, setLoading] = useState({
        dictionary: false,
        language: false
    });

    const onLoadDictionaries = () => {
        setLoading({ ...loading, dictionary: true });
        _service({
            url: "dictionary/list",
            method: "POST",
            data: {
                filters,
                pagination
            },
            success: (response) => {
                setLoading({ ...loading, dictionary: false });
                const { totalElements, items } = response.json.page;
                setData(items);
                setTotal(totalElements);
            },
            fail: (error) => {
                setLoading({ ...loading, dictionary: false });
                console.log(error);
                notification.error({
                    message: Cluar.plainDictionary('dictionary-load-failed-message')
                });
            }
        })
    }

    const onLoadLanguages = () => {
        setLoading({ ...loading, language: true });
        _service({
            url: "language/list",
            method: "POST",
            success: (response) => {
                setLoading({ ...loading, language: false });
                const { items } = response.json.page;
                setLanguages(items);
            },
            fail: (error) => {
                setLoading({ ...loading, language: false });
                console.error(error);
                notification.error({
                    message: "Falha ao carregar idiomas."
                })
            }
        })
    }

    const onReloadTable = () => {
        setFilters({});
        setPagination({
            page: 1,
            size: 10
        });
        onLoadDictionaries();
    }

    useImperativeHandle(ref, () => {
        return {
            onReloadTable
        }
    },[]);

    useEffect(() => {
        onLoadDictionaries();
        onLoadLanguages();
    }, []);

    useEffect(() => {
        onLoadDictionaries();
    }, [pagination, filters])

    const columns = [
        {
            title: Cluar.plainDictionary('dictionary-table-language'),
            dataIndex: 'language',
            key: 'language_codes',
            onHeaderCell: () => ({
                "data-column-key": "language",
            }),
            render: (val) => val.description,
            filtered: filters.language_codes,
            filters: languages.map((language) => ({
                text: language.description,
                value: language.code
            }))
        },
        {
            title: Cluar.plainDictionary('dictionary-table-entry'),
            dataIndex: 'entry',
            key: 'entry_code',
            onHeaderCell: () => ({
                "data-column-key": "entry",
            }),
            render: (val) => val.description
        },
        {
            title: Cluar.plainDictionary('dictionary-table-value'),
            dataIndex: 'value',
            key: 'value',
            onHeaderCell: () => ({
                "data-column-key": "value",
            }),
        },
        {
            title: Cluar.plainDictionary('dictionary-table-actions'),
            dataIndex: 'actions',
            key: 'actions',
            onHeaderCell: () => ({
                "data-column-key": "actions",
            }),
            render: (val, record) => (
                <Button
                    type="text"
                    title="Editar"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setDictionaryData(record);
                        dictionaryModalRef.current.onOpenModal();
                     }}
                />
            )
        }
    ]

    return (
        <div>
            <DictionaryModal
                ref={dictionaryModalRef}
                dictionaryData={dictionaryData}
                onReloadTable={onReloadTable}
            />
            <Table
                columns={columns}
                loading={loading.dictionary}
                dataSource={data}
                scroll={{ x: 600 }}
                pagination={{
                    pageSize: pagination.size,
                    total: total,
                    position: ["bottomRight", "topRight"],
                    onChange: (current) => { setPagination({ ...pagination, page: current }) }
                }}
                onChange={(pagination, currentFilters, currentSorter, { action }) => {
                    if (action === "filter") {
                        const newFilters = {
                            ...filters
                        }
                        Object.keys(currentFilters).forEach((key) => {
                            const value = currentFilters[key];

                            newFilters[key] = value;
                        })
                        setFilters(newFilters);
                    }
                }}
            />
        </div>
    )
})

export default DictionaryTable;