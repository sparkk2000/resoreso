import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';

 
const Navigation = () => {
    return (
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Nav className="mr-auto">
               <Nav.Link href="/uploadcnv">UploadCnv</Nav.Link>
            </Nav>
         </Navbar>
    );
}
 
export default Navigation;
