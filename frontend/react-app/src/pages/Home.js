import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';

import '../App.css';
export default function Home() {
  const data = {
    title: "Virtual Recipe Making",
    content: "Discover new Recipes",
    destination: "/recipes",
    label: "Create Now!"
  };

  return (
    <div className="pageContainer">
      <Banner data={data} />
      <div style={{ marginLeft: '35px' }}> 
        <Button href="/post">Post</Button>
      </div>
    </div>
  );
}

