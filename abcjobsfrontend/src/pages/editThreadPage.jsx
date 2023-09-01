import React from 'react';
import { useParams } from 'react-router-dom';
import EditThreadForm from '../component/editThread';
import Header from '../component/header';

function EditThreadPage() {
  const { threadId } = useParams();

  return (
    <>
      <Header activePage="dashboard" />
      <EditThreadForm threadId={threadId} />
    </>
  );
}

export default EditThreadPage;
