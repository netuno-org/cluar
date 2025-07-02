import React, { useEffect, useRef } from 'react';
import { Modal, Button, Form, Radio, Card, Row, Col } from 'antd';

import { INSERT_LAYOUT_COMMAND } from '../plugins/GridLayoutPlugin';

const columnLayouts = [
  { key: '1', label: '1 Coluna', columns: ['span_1_of_1'] },
  { key: '2', label: '2 Colunas', columns: ['span_1_of_2', 'span_1_of_2'] },
  { key: '3', label: '3 Colunas', columns: ['span_1_of_3', 'span_1_of_3', 'span_1_of_3'] },
  { key: '4', label: '4 Colunas', columns: ['span_1_of_4', 'span_1_of_4', 'span_1_of_4', 'span_1_of_4'] },
  { key: '5', label: '5 Colunas', columns: ['span_1_of_5', 'span_1_of_5', 'span_1_of_5', 'span_1_of_5', 'span_1_of_5'] },
  { key: '6', label: '6 Colunas', columns: ['span_1_of_6', 'span_1_of_6', 'span_1_of_6', 'span_1_of_6', 'span_1_of_6', 'span_1_of_6'] },
  { key: '2-1', label: '2/3 + 1/3', columns: ['span_2_of_3', 'span_1_of_3'] },
  { key: '1-2', label: '1/3 + 2/3', columns: ['span_1_of_3', 'span_2_of_3'] },
  { key: '1-2-1', label: '1/4 + 1/2 + 1/4', columns: ['span_1_of_4', 'span_2_of_4', 'span_1_of_4'] }
];

const convertColumnClassToAntSpan = (columnClass) => {
  const classMap = {
    'span_1_of_1': 24,
    'span_1_of_2': 12,
    'span_1_of_3': 8,
    'span_2_of_3': 16,
    'span_1_of_4': 6,
    'span_2_of_4': 12,
    'span_3_of_4': 18,
    'span_1_of_5': 5,
    'span_1_of_6': 4,
  };
  return classMap[columnClass] || 12;
};

export default function ColumnsModal({ visible, onClose, activeEditor }) {
  const [form] = Form.useForm();
  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, []);

  const onInsert = (payload) => {
    const result = activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, payload);
    console.log('onInsert columns result', result);
    onClose();
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const selectedLayout = columnLayouts.find(layout => layout.key === values.layout);
      
      if (selectedLayout) {
        onInsert(selectedLayout.columns);
      }
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  const renderColumnPreview = (columns) => {
    return (
      <Row gutter={8} style={{ height: '40px' }}>
        {columns.map((columnClass, index) => {
          const antSpan = convertColumnClassToAntSpan(columnClass);
          return (
            <Col key={index} span={antSpan}>
              <div style={{
                background: '#f0f0f0',
                height: '100%',
                border: '1px solid #d9d9d9',
                borderRadius: '4px'
              }} />
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <Modal
      title="Inserir Colunas"
      open={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      footer={[
        <Button key="cancel" onClick={() => {
          onClose();
          form.resetFields();
        }}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Inserir
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical" initialValues={{ layout: '2' }}>
        <Form.Item
          name="layout"
          label="Selecione o Layout das Colunas"
          rules={[{ required: true, message: 'Selecione um layout!' }]}
        >
          <Radio.Group style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              {columnLayouts.map((layout) => (
                <Col span={12} key={layout.key}>
                  <Card 
                    size="small" 
                    style={{ cursor: 'pointer' }}
                    bodyStyle={{ padding: '12px' }}
                  >
                    <Radio value={layout.key} style={{ marginBottom: '8px' }}>
                      {layout.label}
                    </Radio>
                    {renderColumnPreview(layout.columns)}
                  </Card>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}