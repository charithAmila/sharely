import React from 'react';
import { IonNav } from '@ionic/react';

import PageOne from './PageOne';
import Tags from './Tags';
import { useAppContext } from '../context/MainContext';

function Tab2() {
  const {tags, createTag} = useAppContext();
  return <IonNav root={() => <PageOne  />}></IonNav>;
}
export default Tab2;