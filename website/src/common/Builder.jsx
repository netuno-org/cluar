import React, { useEffect, useState } from 'react';

import { Alert } from 'antd';

import sal from 'sal.js';

import Cluar from '../common/Cluar';

import PageSection from '../base/PageSection';
import Banner from '../components/Banner';
import Content from '../components/Content';
import Listing from '../components/Listing';
import ContactForm from '../components/functionality/ContactForm';
import ContactMap from '../components/functionality/ContactMap';

function Builder({ page }) {
  const [error, setError] = useState(false);
  const [structure, setStructure] = useState([]);
  useEffect(() => {
    fetch(`/cluar/structures/${page.uid}.json?time=${new Date().getTime()}`)
      .then(response => response.json())
      .then(data => {
        setError(false);
        setStructure(data);
      })
      .catch(error => {
        setError(true);
        console.error('Failed to load page structure: ', {page, error});
      });
    document.getElementsByTagName('meta')["keywords"].content = page.keywords;
    document.getElementsByTagName('meta')["description"].content = page.description;
    document.title = page.title + ' | ' + Cluar.config().name;
  }, [page]);

  const handleAddNewSection = (data, current) => {
    const index = structure.findIndex((item) => item.uid === current);

    if (index !== -1) {
      const newStructure = [...structure];
      newStructure.splice(index + 1, 0, data);
      setStructure(newStructure);
    }
  };

  const handleChangeSection = (data, current) => {
    const index = structure.findIndex((item) => item.uid === current);

    if (index !== -1) {
      const newStructure = [...structure];
      newStructure[index] = data;
      setStructure(newStructure);
    }
  };

  useEffect(() => {
    sal({
      threshold: 1,
      once: false,
    });
  }, [structure]);

  const components = [];
  for (const item of structure) {
    const { uid } = item;
    if (item.section === "banner") {
      components.push(
        <PageSection
          sectionData={item}
          onNewSection={(data) => handleAddNewSection(data, uid)}
          onConfirmChanges={(data) => handleChangeSection(data, uid)}
        >
          <Banner key={uid} {...item} />
        </PageSection>
      );
    } else if (item.section === "content") {
      components.push(
        <PageSection
          sectionData={item}
          onNewSection={(data) => handleAddNewSection(data, uid)}
          onConfirmChanges={(data) => handleChangeSection(data, uid)}
        >
          <Content key={uid} {...item} />
        </PageSection>
      );
    } else if (item.section === "listing") {
      components.push(
        <PageSection
          sectionData={item}
          onNewSection={(data) => handleAddNewSection(data, uid)}
          onConfirmChanges={(data) => handleChangeSection(data, uid)}
        >
          <Listing key={uid} {...item} />
        </PageSection>
      );
    } else if (item.section === "functionality") {
      if (item.type === "contact-form") {
        components.push(<ContactForm key={uid} {...item} />);
      } else if (item.type === "contact-map") {
        components.push(<ContactMap key={uid} {...item} />);
      }
    }
  }
  if (error) {
    return (
      <main>
        <Alert
          style={{maxWidth: '400px', width: 'calc(100% - 20px)', margin: '50px auto 50px auto'}}
          message="Error"
          description="The page content could not be loaded."
          type="error"
          showIcon
        />
      </main>
    );
  }
  return (
    <main>
      {components}
    </main>
  );
}

export default Builder;
