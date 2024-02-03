import React from "react";

import { Typography, Tabs } from "antd";

import ContactTable from "../ContactTable";

import CluarSync from "../../components/cluar/Sync";

const { Title } = Typography;

const { TabPane } = Tabs;

function DashboardContainer() {
  const Tab1 = () => {
    return (
      <div>
        <p>Lista de contactos submetidos pelo formulário do website.</p>
        <ContactTable />
      </div>
    );
  };
  const item = [
    {
      label: 'Contactos',
      key: '1',
      children: <Tab1 />,
    },
  ];
  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Tabs items={item} />
      <CluarSync />
    </div>
  );
}

export default DashboardContainer;
