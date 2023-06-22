import "../styles/AppHeader.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from "../layout/Home";
import logo from "../logo/logo.png";
import TableList from "../layout/TableList";
import Create from "../layout/Create";
import UserList from "../layout/UserList";
import DetailItemShare from "../layout/DetailShareItem";

function AppHeader() {
  return (
    <BrowserRouter>
      {/* <div className='App'> */}
      <div className="navigation">
        <Navbar bg="#1B79DB" variant="dark">
          <Container>
            <Navbar.Brand as={Link} className="brand-name">
              <img src={logo} width="60" height="60" />
              Admin
            </Navbar.Brand>
            <Nav className="navigation-menu">
              {/* <Nav.Link as={Link} to={'/Home'} className="name-menu">
                  Home
                </Nav.Link> */}
              <Nav.Link as={Link} to={"/TableList"} className="name-menu">
                Item
              </Nav.Link>
              <Nav.Link as={Link} to={"/Create"} className="name-menu">
                Create
              </Nav.Link>
              <Nav.Link as={Link} to={"/UserList"} className="name-menu">
                User
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </div>
      {/* </div> */}
      <Routes>
        {/* <Route path='/Home' element={<Home/>}/> */}
        <Route path="/TableList" element={<TableList />} />
        <Route path="/Create" element={<Create />} />
        <Route path="/UserList" element={<UserList />} />
        <Route path="/detail/:id" element={<DetailItemShare />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppHeader;
